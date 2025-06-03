import { IBiomark } from './biomark.interface';
import { Biomark } from './biomark.model';
import openai from '../../../shared/openAI';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { ChatCompletionMessageParam } from 'openai/resources';

const biomarkerTest = async (payload: any): Promise<string[]> => {
  const { des, userId } = payload;

  const prompt = `
A user has reported the following symptoms or concerns:

"${des}"

Based on this information, suggest appropriate tests the user might consider. Focus on relevant mental health screenings (e.g., depression, anxiety), hormone level tests (e.g., cortisol, thyroid), or any related physical biomarkers.

Return a list like:
1. [Test Name] - [Short Reason]

Only include tests that are relevant based on the input.
`;

  const messages: ChatCompletionMessageParam[] = [
    { role: 'user', content: prompt },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.7,
  });

  const content = response.choices?.[0]?.message?.content ?? '';
  if (!content) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'No response from OpenAI',
    );
  }

  const testNames = content
    .split('\n')
    .map(line => {
      const match = line.match(/^\d+\.\s*(.*?)\s*-/);
      return match ? match[1].trim() : null;
    })
    .filter((name): name is string => Boolean(name));

  if (testNames.length === 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'No valid test suggestions extracted',
    );
  }

  const biomarkData = testNames.map(testName => ({ testName, userId }));
  const inserted = await Biomark.insertMany(biomarkData);

  if (!inserted || inserted.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Biomark not created!');
  }

  return testNames;
};

const createBiamark = async (data: Record<string, any> | IBiomark) => {
  let biomarksToInsert: IBiomark[] = [];

  if ('testName' in data) {
    biomarksToInsert = [data as IBiomark];
  } else {
    const userId = (data as any).userId;

    biomarksToInsert = Object.keys(data)
      .filter(key => !isNaN(Number(key)))
      .map(key => ({
        ...data[key],
        ...(userId && { userId }),
      }));
  }

  const result = await Biomark.insertMany(biomarksToInsert);
  return result;
};

const createBiamarkExtra = async (data: Record<string, any> | IBiomark) => {
  data.upload = true;

  const result = await Biomark.create(data as IBiomark);
  return result;
};

const getPendingBiomarks = async (userId: string) => {
  const result = await Biomark.find({ userId, upload: false });
  return result;
};

const uploadBiomarks = async (selectedIds: string[]) => {
  const result = await Biomark.updateMany(
    { _id: { $in: selectedIds } },
    { $set: { upload: true } },
  );
  return result;
};

const getUpdatedBiomarks = async (userId: string) => {
  const latestEntry: any = await Biomark.findOne({ userId })
    .sort({ updatedAt: -1 })
    .select('updatedAt');

  if (!latestEntry) return [];

  const latestDate = new Date(latestEntry.updatedAt);

  latestDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(latestDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const result = await Biomark.find({
    userId,
    upload: true,
    updatedAt: { $gte: latestDate, $lt: nextDay },
  });

  return result;
};

export const BiomarkService = {
  createBiamark,
  getPendingBiomarks,
  uploadBiomarks,
  getUpdatedBiomarks,
  createBiamarkExtra,
  biomarkerTest,
};
