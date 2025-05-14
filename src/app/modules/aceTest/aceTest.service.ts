import { Types } from 'mongoose';
import { IAceTest } from './aceTest.interface';
import { AceTest } from './aceTest.model';
import openai from '../../../shared/openAI';

const createAceTest = async (data: Pick<IAceTest, 'userId' | 'score'>) => {
  const getSeverityLevelAndSuggestion = (score: number) => {
    let severityLevel: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
    let suggestions: string;

    if (score >= 0 && score <= 1) {
      severityLevel = 'Normal';
      suggestions =
        'You reported minimal or no exposure to adverse childhood experiences. Continue fostering supportive relationships and positive environments.';
    } else if (score <= 3) {
      severityLevel = 'Mild';
      suggestions =
        'Some childhood adversity is indicated. It may be helpful to reflect on how these experiences shape your present and consider tools to support resilience.';
    } else if (score <= 6) {
      severityLevel = 'Moderate';
      suggestions =
        'Your score suggests moderate exposure to adversity. Connecting with a mental health professional could help you explore coping strategies and build emotional well-being.';
    } else if (score <= 10) {
      severityLevel = 'Severe';
      suggestions =
        'High levels of childhood adversity are indicated. Seeking trauma-informed care from a licensed professional is strongly encouraged to support long-term healing and resilience.';
    } else {
      throw new Error('Invalid ACE score. Must be between 0 and 10.');
    }

    return { severityLevel, suggestions };
  };

  const { severityLevel, suggestions } = getSeverityLevelAndSuggestion(
    data.score,
  );

  return await AceTest.create({
    userId: new Types.ObjectId(data.userId),
    score: data.score,
    severityLevel,
    suggestions,
  });
};

const getAceTest = async (userId: string, query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;
  const result = await AceTest.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await AceTest.countDocuments({ userId });
  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

const getResultWithAi = async (userId: string) => {
  const result = await AceTest.findOne({ userId }).sort({ createdAt: -1 });
  if (!result) return { message: 'No ACE test result found for this user.' };

  const prompt = `
You are a psychologist AI. Based on the following ACE test result, provide a compassionate and insightful summary that explains the severity, score, and offers an encouraging perspective.

Data:
- Score: ${result.score}
- Severity Level: ${result.severityLevel}
- Suggestions: ${result.suggestions}

Please return a 3–5 sentence summary suitable for sharing with the user.
`;

  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are an empathetic assistant trained in psychological assessments.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });

  const summary = aiResponse.choices[0].message.content;
  return {
    // ...result.toObject(),
    aiSummary: summary,
  };
};

export const aceTestService = {
  createAceTest,
  getAceTest,
  getResultWithAi,
};
