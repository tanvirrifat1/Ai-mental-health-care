import { Types } from 'mongoose';
import { MsiBpdTest } from './msiTest.model';
import { IMsiTest } from './msiTest.interface';
import openai from '../../../shared/openAI';

const createMsiBpdTest = async (data: Pick<IMsiTest, 'userId' | 'score'>) => {
  const getSeverityLevelAndSuggestion = (score: number) => {
    let severityLevel: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
    let suggestions: string;

    if (score >= 0 && score <= 3) {
      severityLevel = 'Normal';
      suggestions =
        'Your responses indicate minimal signs of borderline personality traits. Maintaining healthy emotional habits and self-awareness is beneficial.';
    } else if (score <= 5) {
      severityLevel = 'Mild';
      suggestions =
        'You may show some traits of emotional instability or impulsivity. Consider monitoring your behaviors and seeking support if distress increases.';
    } else if (score <= 7) {
      severityLevel = 'Moderate';
      suggestions =
        'Your score suggests moderate signs of borderline personality disorder. Speaking with a licensed therapist could provide helpful insight and coping strategies.';
    } else if (score <= 10) {
      severityLevel = 'Severe';
      suggestions =
        'Your score indicates strong symptoms commonly associated with BPD. A professional evaluation by a mental health expert is highly recommended for support and care planning.';
    } else {
      throw new Error('Invalid MSI-BPD score. Must be between 0 and 10.');
    }

    return { severityLevel, suggestions };
  };

  const { severityLevel, suggestions } = getSeverityLevelAndSuggestion(
    data.score,
  );

  return await MsiBpdTest.create({
    userId: new Types.ObjectId(data.userId),
    score: data.score,
    severityLevel,
    suggestions,
  });
};

const getMsiBpdTest = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;
  const result = await MsiBpdTest.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await MsiBpdTest.countDocuments({ userId });
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

const getMsibpdResultWithAi = async (userId: string) => {
  const result = await MsiBpdTest.findOne({ userId }).sort({ createdAt: -1 });
  if (!result) return null;

  const prompt = `
You are a compassionate mental health assistant. A user has completed the MSI-BPD (McLean Screening Instrument for Borderline Personality Disorder). 
Based on the following data, generate a kind, non-alarming 3–5 sentence summary that:
- Explains what the score and severity may indicate
- Encourages the user to seek further support
- Reassures them about the possibility of healing

Data:
- Score: ${result.score}
- Severity Level: ${result.severityLevel}
- Suggestions: ${result.suggestions}
`;

  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a caring assistant trained in mental health communication.',
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

export const msiTestService = {
  createMsiBpdTest,
  getMsiBpdTest,
  getMsibpdResultWithAi,
};
