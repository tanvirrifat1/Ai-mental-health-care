import { Types } from 'mongoose';
import { IMdqTest } from './mdqTest.interface';
import { MdqTest } from './mdqTest.model';
import openai from '../../../shared/openAI';

const createMdqTest = async (data: Pick<IMdqTest, 'userId' | 'score'>) => {
  const getSeverityLevelAndSuggestion = (score: number) => {
    let severityLevel: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
    let suggestions: string;

    if (score >= 0 && score <= 4) {
      severityLevel = 'Normal';
      suggestions =
        'Your responses suggest no significant signs of mood instability. Maintain balanced routines and monitor your mood over time.';
    } else if (score <= 6) {
      severityLevel = 'Mild';
      suggestions =
        'Some signs of mood variation are present. It’s helpful to track changes and consider stress management or support if symptoms increase.';
    } else if (score <= 9) {
      severityLevel = 'Moderate';
      suggestions =
        'Your score indicates potential mood-related symptoms. A mental health professional can provide further assessment and guidance.';
    } else if (score <= 13) {
      severityLevel = 'Severe';
      suggestions =
        'Your score suggests strong indicators of mood disorder symptoms. A comprehensive evaluation by a mental health professional is strongly recommended.';
    } else {
      throw new Error('Invalid MDQ score. Must be between 0 and 13.');
    }

    return { severityLevel, suggestions };
  };

  const { severityLevel, suggestions } = getSeverityLevelAndSuggestion(
    data.score,
  );

  return await MdqTest.create({
    userId: new Types.ObjectId(data.userId),
    score: data.score,
    severityLevel,
    suggestions,
  });
};

const getMdqTest = async (userId: string, query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;
  const result = await MdqTest.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await MdqTest.countDocuments({ userId });
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

const getMdqResultWithAi = async (userId: string) => {
  const result = await MdqTest.findOne({ userId }).sort({ createdAt: -1 });
  if (!result) return null;

  const prompt = `
You are a mental health assistant. A user has completed the MDQ (Mood Disorder Questionnaire) to assess for bipolar disorder. 
Please generate a thoughtful summary based on the following data:

- Score: ${result.score}
- Severity Level: ${result.severityLevel}
- Suggestions: ${result.suggestions}

Provide a 3-5 sentence summary that explains the significance of the score, what it suggests about potential bipolar disorder, and offers encouraging next steps.
`;

  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a compassionate assistant offering mental health summaries.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });

  const summary = aiResponse.choices[0].message.content;
  return {
    aiSummary: summary,
  };
};

export const mdqService = {
  createMdqTest,
  getMdqTest,
  getMdqResultWithAi,
};
