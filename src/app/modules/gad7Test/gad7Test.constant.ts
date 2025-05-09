export const getSeverityLevelAndSuggestion = (score: number) => {
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
