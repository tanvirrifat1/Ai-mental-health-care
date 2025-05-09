import { Dass21 } from './dass21.model';

const createDass21 = async (data: { score: number; userId?: string }) => {
  try {
    const mapToSeverity = (score: number, category: string): string => {
      if (category === 'depression') {
        if (score <= 9) return 'Normal';
        if (score <= 13) return 'Mild';
        if (score <= 20) return 'Moderate';
        if (score <= 27) return 'Severe';
        return 'Extremely Severe';
      }

      if (category === 'anxiety') {
        if (score <= 7) return 'Normal';
        if (score <= 9) return 'Mild';
        if (score <= 14) return 'Moderate';
        if (score <= 19) return 'Severe';
        return 'Extremely Severe';
      }

      if (category === 'stress') {
        if (score <= 14) return 'Normal';
        if (score <= 18) return 'Mild';
        if (score <= 25) return 'Moderate';
        if (score <= 33) return 'Severe';
        return 'Extremely Severe';
      }

      return 'Unknown';
    };

    const generateSuggestions = (
      depressionLevel: string,
      anxietyLevel: string,
      stressLevel: string,
    ): string => {
      let suggestions = 'Here are some suggestions based on your results:\n';

      if (
        depressionLevel === 'Moderate' ||
        depressionLevel === 'Severe' ||
        depressionLevel === 'Extremely Severe'
      ) {
        suggestions += 'Consider seeking professional help for depression.\n';
      }

      if (
        anxietyLevel === 'Moderate' ||
        anxietyLevel === 'Severe' ||
        anxietyLevel === 'Extremely Severe'
      ) {
        suggestions +=
          'Try relaxation techniques or seek support for anxiety.\n';
      }

      if (stressLevel === 'Severe' || stressLevel === 'Extremely Severe') {
        suggestions +=
          'Take time to reduce stress and seek guidance if necessary.\n';
      }

      return suggestions;
    };

    const score = data.score;

    const categories = ['depression', 'anxiety', 'stress'];

    let result: any = {};

    for (let category of categories) {
      const severityLevel = mapToSeverity(score, category);
      result[category] = {
        score,
        severityLevel,
        suggestions: generateSuggestions(
          category === 'depression' ? severityLevel : 'Normal',
          category === 'anxiety' ? severityLevel : 'Normal',
          category === 'stress' ? severityLevel : 'Normal',
        ),
      };
    }

    const value = {
      ...result,
      userId: data?.userId,
    };

    const newResult = await Dass21.create(value);

    return newResult;
  } catch (error) {
    throw error;
  }
};

const getAllDass21 = async (userId: string, query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Dass21.find({ userId: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Dass21.countDocuments({ userId: userId });

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

export const Dass21Service = { createDass21, getAllDass21 };
