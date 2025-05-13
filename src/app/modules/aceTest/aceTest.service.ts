import { Types } from 'mongoose';
import { IAceTest } from './aceTest.interface';
import { AceTest } from './aceTest.model';

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

export const aceTestService = {
  createAceTest,
};
