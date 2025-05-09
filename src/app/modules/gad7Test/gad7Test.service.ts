import { getSeverityLevelAndSuggestion } from './gad7Test.constant';
import { IGad7Test } from './gad7Test.interface';
import { Gad7Test } from './gad7Test.model';

const createGad7Test = async (data: Pick<IGad7Test, 'userId' | 'score'>) => {
  const { severityLevel, suggestions } = getSeverityLevelAndSuggestion(
    data.score,
  );

  return await Gad7Test.create({
    ...data,
    severityLevel,
    suggestions,
  });
};

export const Gad7TestService = {
  createGad7Test,
};
