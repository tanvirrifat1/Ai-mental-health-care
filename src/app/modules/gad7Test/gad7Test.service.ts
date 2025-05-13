import { IGad7Test } from './gad7Test.interface';
import { Gad7Test } from './gad7Test.model';

const createGad7Test = async (data: Pick<IGad7Test, 'userId' | 'score'>) => {
  const getSeverityLevelAndSuggestion = (score: number) => {
    let severityLevel: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
    let suggestions: string;

    if (score >= 0 && score <= 4) {
      severityLevel = 'Normal';
      suggestions =
        'Your anxiety levels appear within a healthy range. No specific action is needed, but continue practicing good mental health habits.';
    } else if (score <= 9) {
      severityLevel = 'Mild';
      suggestions =
        'You may be experiencing mild anxiety. Try incorporating relaxation techniques like mindfulness, deep breathing, or regular physical activity. Keep monitoring how you feel.';
    } else if (score <= 14) {
      severityLevel = 'Moderate';
      suggestions =
        'Moderate anxiety symptoms are present. It could be helpful to talk to a mental health professional or counselor. Early intervention can be very effective.';
    } else if (score <= 21) {
      severityLevel = 'Severe';
      suggestions =
        'Your score indicates severe anxiety. Seeking support from a licensed mental health professional is strongly recommended to help manage symptoms and improve well-being.';
    } else {
      throw new Error('Invalid GAD-7 score. Must be between 0 and 21.');
    }

    return { severityLevel, suggestions };
  };

  const { severityLevel, suggestions } = getSeverityLevelAndSuggestion(
    data.score,
  );

  return await Gad7Test.create({
    ...data,
    severityLevel,
    suggestions,
  });
};

const getGad7Test = async (userId: string, query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;
  const result = await Gad7Test.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Gad7Test.countDocuments({ userId });

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

export const Gad7TestService = {
  createGad7Test,
  getGad7Test,
};
