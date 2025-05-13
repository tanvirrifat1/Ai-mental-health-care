import { Types } from 'mongoose';
import { MsiBpdTest } from './msiTest.model';
import { IMsiTest } from './msiTest.interface';

const createMsiBpdTest = async (data: Pick<IMsiTest, 'userId' | 'score'>) => {
  const getSeverityLevelAndSuggestion = (score: number) => {
    let severityLevel: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
    let suggestions: string;

    if (score >= 0 && score <= 3) {
      severityLevel = 'Normal';
      suggestions =
        'Your responses indicate minimal signs of borderline personality traits. Maintaining healthy emotional habits and self-awareness is beneficial.';
    } else if (score <= 5) {
      severityLevel = 'Mild';
      suggestions =
        'You may show some traits of emotional instability or impulsivity. Consider monitoring your behaviors and seeking support if distress increases.';
    } else if (score <= 7) {
      severityLevel = 'Moderate';
      suggestions =
        'Your score suggests moderate signs of borderline personality disorder. Speaking with a licensed therapist could provide helpful insight and coping strategies.';
    } else if (score <= 10) {
      severityLevel = 'Severe';
      suggestions =
        'Your score indicates strong symptoms commonly associated with BPD. A professional evaluation by a mental health expert is highly recommended for support and care planning.';
    } else {
      throw new Error('Invalid MSI-BPD score. Must be between 0 and 10.');
    }

    return { severityLevel, suggestions };
  };

  const { severityLevel, suggestions } = getSeverityLevelAndSuggestion(
    data.score,
  );

  return await MsiBpdTest.create({
    userId: new Types.ObjectId(data.userId),
    score: data.score,
    severityLevel,
    suggestions,
  });
};

export const msiTestService = {
  createMsiBpdTest,
};
