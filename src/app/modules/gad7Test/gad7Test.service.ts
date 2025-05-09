import { IGad7Test } from './gad7Test.interface';
import { Gad7Test } from './gad7Test.model';

export const getSeverityLevelAndSuggestion = (score: number) => {
  if (score <= 4) {
    return {
      severityLevel: 'Normal',
      suggestions: 'No significant anxiety. No intervention needed.',
    };
  } else if (score <= 9) {
    return {
      severityLevel: 'Mild',
      suggestions: 'Monitor symptoms. Lifestyle adjustments recommended.',
    };
  } else if (score <= 14) {
    return {
      severityLevel: 'Moderate',
      suggestions: 'Consider therapy or mental health consultation.',
    };
  } else if (score <= 21) {
    return {
      severityLevel: 'Severe',
      suggestions:
        'Strongly consider professional help. May need therapy or medication.',
    };
  } else {
    return {
      severityLevel: 'Extremely Severe',
      suggestions: 'Immediate mental health intervention recommended.',
    };
  }
};

const createGad7Test = async (data: Pick<IGad7Test, 'userId' | 'score'>) => {
  const { severityLevel, suggestions } = getSeverityLevelAndSuggestion(
    data.score,
  );

  const result = await Gad7Test.create({
    ...data,
    severityLevel,
    suggestions,
  });

  return result;
};

export const Gad7TestService = {
  createGad7Test,
};
