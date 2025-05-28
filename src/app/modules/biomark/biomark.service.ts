import OpenAI from 'openai';
import { IBiomark } from './biomark.interface';
import { Biomark } from './biomark.model';
import openai from '../../../shared/openAI';

const biomarkerTest = async (payload: any): Promise<string[]> => {
  const { des } = payload;

  const prompt = `
A user has reported the following symptoms or concerns:

"${des}"

Based on this information, suggest appropriate tests the user might consider. Focus on relevant mental health screenings (e.g., depression, anxiety), hormone level tests (e.g., cortisol, thyroid), or any related physical biomarkers.

Return a list like:
1. [Test Name] - [Short Reason]

Only include tests that are relevant based on the input.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const suggestion = response.choices[0].message.content || '';

  // Extract test names using regex
  const testNames = suggestion
    .split('\n')
    .map(line => {
      const match = line.match(/^\d+\.\s*(.*?)\s*-/);
      return match ? match[1].trim() : null;
    })
    .filter(Boolean) as string[];

  return testNames;
};

const createBiamark = async (data: Record<string, any> | IBiomark) => {
  let biomarksToInsert: IBiomark[] = [];

  if ('testName' in data && 'description' in data) {
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
