import { IMoodTracker } from './moodTracker.interface';
import { MoodTracker } from './moodTracker.model';

const createMoonTracker = async (data: IMoodTracker) => {
  const result = await MoodTracker.create(data);
  return result;
};

export const MoodTrackerService = {
  createMoonTracker,
};
