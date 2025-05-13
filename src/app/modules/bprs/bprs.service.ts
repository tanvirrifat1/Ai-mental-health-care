import { Bprs } from './bprs.model';
import { IBprs } from './bprs.interface';
import { Types } from 'mongoose';

const createBprs = async (data: Pick<IBprs, 'userId' | 'score'>) => {
  const getSeverityLevelAndSuggestion = (score: number) => {
    let severityLevel: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
    let suggestions: string;

    if (score >= 0 && score <= 30) {
      severityLevel = 'Normal';
      suggestions =
        'Your results suggest no significant psychiatric symptoms at this time. Maintain healthy routines and check in with yourself regularly.';
    } else if (score <= 40) {
      severityLevel = 'Mild';
      suggestions =
        'Mild symptoms are present. Consider enhancing self-care strategies, such as stress management, mindfulness, and social support. Stay observant of any changes in your mental well-being.';
    } else if (score <= 53) {
      severityLevel = 'Moderate';
      suggestions =
        'Moderate psychiatric symptoms are indicated. It may be beneficial to consult with a mental health professional for further assessment and support.';
    } else if (score > 53) {
      severityLevel = 'Severe';
      suggestions =
        'Severe symptoms are present. Prompt consultation with a licensed mental health professional is strongly recommended for comprehensive evaluation and care planning.';
    } else {
      throw new Error('Invalid BPRS score. Must be a non-negative number.');
    }

    return { severityLevel, suggestions };
  };

  const { severityLevel, suggestions } = getSeverityLevelAndSuggestion(
    data.score,
  );

  return await Bprs.create({
    userId: new Types.ObjectId(data.userId),
    score: data.score,
    severityLevel,
    suggestions,
  });
};

const getBprs = async (userId: string, query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;
  const result = await Bprs.find({ userId: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Bprs.countDocuments({ userId: userId });
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

export const bprsService = {
  createBprs,
  getBprs,
};
