import { Types } from 'mongoose';
import { IMdqTest } from './mdqTest.interface';
import { MdqTest } from './mdqTest.model';

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

export const mdqService = {
  createMdqTest,
};
