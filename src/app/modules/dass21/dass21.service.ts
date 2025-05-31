import openai from '../../../shared/openAI';
import { Dass21 } from './dass21.model';

// const createDass21 = async (data: { score: number; userId?: string }) => {
//   try {
//     const mapToSeverity = (score: number, category: string): string => {
//       if (category === 'depression') {
//         if (score <= 9) return 'Normal';
//         if (score <= 13) return 'Mild';
//         if (score <= 20) return 'Moderate';
//         if (score <= 27) return 'Severe';
//         return 'Extremely Severe';
//       }

//       if (category === 'anxiety') {
//         if (score <= 7) return 'Normal';
//         if (score <= 9) return 'Mild';
//         if (score <= 14) return 'Moderate';
//         if (score <= 19) return 'Severe';
//         return 'Extremely Severe';
//       }

//       if (category === 'stress') {
//         if (score <= 14) return 'Normal';
//         if (score <= 18) return 'Mild';
//         if (score <= 25) return 'Moderate';
//         if (score <= 33) return 'Severe';
//         return 'Extremely Severe';
//       }

//       return 'Unknown';
//     };

//     const generateSuggestions = (
//       depressionLevel: string,
//       anxietyLevel: string,
//       stressLevel: string,
//     ): string => {
//       let suggestions = 'Here are some suggestions based on your results:\n';

//       if (
//         depressionLevel === 'Moderate' ||
//         depressionLevel === 'Severe' ||
//         depressionLevel === 'Extremely Severe'
//       ) {
//         suggestions += 'Consider seeking professional help for depression.\n';
//       }

//       if (
//         anxietyLevel === 'Moderate' ||
//         anxietyLevel === 'Severe' ||
//         anxietyLevel === 'Extremely Severe'
//       ) {
//         suggestions +=
//           'Try relaxation techniques or seek support for anxiety.\n';
//       }

//       if (stressLevel === 'Severe' || stressLevel === 'Extremely Severe') {
//         suggestions +=
//           'Take time to reduce stress and seek guidance if necessary.\n';
//       }

//       return suggestions;
//     };

//     const score = data.score;

//     const categories = ['depression', 'anxiety', 'stress'];

//     let result: any = {};

//     for (let category of categories) {
//       const severityLevel = mapToSeverity(score, category);
//       result[category] = {
//         score,
//         severityLevel,
//         suggestions: generateSuggestions(
//           category === 'depression' ? severityLevel : 'Normal',
//           category === 'anxiety' ? severityLevel : 'Normal',
//           category === 'stress' ? severityLevel : 'Normal',
//         ),
//       };
//     }

//     const value = {
//       ...result,
//       userId: data?.userId,
//     };

//     const newResult = await Dass21.create(value);

//     return newResult;
//   } catch (error) {
//     throw error;
//   }
// };

const createDass21 = async (data: { score: number; userId?: string }) => {
  try {
    const mapToSeverity = (score: number, category: string): string => {
      const thresholds: Record<string, number[]> = {
        depression: [9, 13, 20, 27],
        anxiety: [7, 9, 14, 19],
        stress: [14, 18, 25, 33],
      };

      const labels = [
        'Normal',
        'Mild',
        'Moderate',
        'Severe',
        'Extremely Severe',
      ];
      const limits = thresholds[category] || [];

      for (let i = 0; i < limits.length; i++) {
        if (score <= limits[i]) return labels[i];
      }

      return labels[limits.length];
    };

    const generateSuggestions = (levels: Record<string, string>): string => {
      const suggestions: string[] = [];

      if (
        ['Moderate', 'Severe', 'Extremely Severe'].includes(levels.depression)
      ) {
        suggestions.push('Consider seeking professional help for depression.');
      }

      if (['Moderate', 'Severe', 'Extremely Severe'].includes(levels.anxiety)) {
        suggestions.push(
          'Try relaxation techniques or seek support for anxiety.',
        );
      }

      if (['Severe', 'Extremely Severe'].includes(levels.stress)) {
        suggestions.push(
          'Take time to reduce stress and seek guidance if necessary.',
        );
      }

      return suggestions.length
        ? `Here are some suggestions based on your results:\n${suggestions.join('\n')}`
        : 'No specific concerns detected. Keep maintaining your mental well-being!';
    };

    const totalScore = data.score;
    const averagePerCategory = Math.round(totalScore / 3);

    const categories = ['depression', 'anxiety', 'stress'];
    const severityLevels: Record<string, string> = {};
    const result: any = {};

    for (let category of categories) {
      const severity = mapToSeverity(averagePerCategory, category);
      severityLevels[category] = severity;
    }

    const suggestions = generateSuggestions(severityLevels);

    for (let category of categories) {
      result[category] = {
        score: averagePerCategory,
        severityLevel: severityLevels[category],
        suggestions,
      };
    }

    const value = {
      ...result,
      userId: data.userId,
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

const getResultWithAi = async (userId: string) => {
  const latestResult: any = await Dass21.findOne({ userId })
    .sort({ createdAt: -1 })
    .lean();

  if (!latestResult) {
    return { message: 'No results found for this user.' };
  }

  const formattedData = `
Latest DASS-21 Assessment (Date: ${new Date(latestResult.createdAt).toDateString()})

Depression:
- Score: ${latestResult.depression.score} (${latestResult.depression.severityLevel})
- Suggestion: ${latestResult.depression.suggestions || 'No suggestion provided'}

Anxiety:
- Score: ${latestResult.anxiety.score} (${latestResult.anxiety.severityLevel})
- Suggestion: ${latestResult.anxiety.suggestions || 'No suggestion provided'}

Stress:
- Score: ${latestResult.stress.score} (${latestResult.stress.severityLevel})
- Suggestion: ${latestResult.stress.suggestions || 'No suggestion provided'}
`;

  const prompt = `
A user has completed the DASS-21 assessment. Below are their scores, severity levels, and professional suggestions.

${formattedData}

Please summarize the user's current mental health status in an empathetic tone. Use the suggestions to provide gentle guidance on how the user can work toward recovery. Highlight any concerns, coping tips, or encouraging messages you find relevant.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const summary = completion.choices[0].message.content;

  return { summary };
};

export const Dass21Service = { createDass21, getAllDass21, getResultWithAi };
