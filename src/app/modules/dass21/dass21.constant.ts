export const generateSuggestions = (
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
    suggestions += 'Try relaxation techniques or seek support for anxiety.\n';
  }

  if (stressLevel === 'Severe' || stressLevel === 'Extremely Severe') {
    suggestions +=
      'Take time to reduce stress and seek guidance if necessary.\n';
  }

  return suggestions;
};
