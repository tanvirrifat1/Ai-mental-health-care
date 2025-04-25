import { Types } from 'mongoose';
import { IMoodTracker } from './moodTracker.interface';
import { MoodTracker } from './moodTracker.model';
import { MOOD_ORDER } from './moodTracker.constants';

const createMoonTracker = async (data: IMoodTracker) => {
  const result = await MoodTracker.create(data);
  return result;
};

const getMyMoodTracker = async (
  user: string,
  query: Record<string, unknown>,
) => {
  const { page, limit, startDate, endDate, ...filterData } = query;
  const anyConditions: any[] = [];

  // User filter
  anyConditions.push({ user });

  // Date range filter
  if (startDate && endDate) {
    anyConditions.push({
      date: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    });
  }

  // Other filters
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value }),
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Data fetch
  const result = await MoodTracker.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await MoodTracker.countDocuments(whereConditions);

  // Stats calculation for the selected date range only
  const moodStats = await MoodTracker.aggregate([
    {
      $match: {
        user: new Types.ObjectId(user),
        ...(startDate && endDate
          ? {
              date: {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
              },
            }
          : {}),
      },
    },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 },
      },
    },
  ]);

  const formatStats = (data: { _id: string; count: number }[]) => {
    const base = {
      great: 0,
      good: 0,
      okay: 0,
      low: 0,
      very_low: 0,
    };
    data.forEach(item => {
      base[item._id as keyof typeof base] = item.count;
    });
    return base;
  };

  return {
    meta: {
      page: pages,
      total: count,
    },
    stats: formatStats(moodStats),
  };
};

const getTrackMessage = async (user: string) => {
  // Get last 30 days of mood entries
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const entries = await MoodTracker.find({
    user: new Types.ObjectId(user),
    date: { $gte: last30Days },
  })
    .sort({ date: 1 })
    .lean();

  if (entries.length === 0) {
    return {
      message: 'No mood data found in the last 30 days.',
    };
  }

  // Most Common Mood
  const moodCount: Record<string, number> = {};
  for (const entry of entries) {
    moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
  }
  const mostCommonMood = Object.entries(moodCount).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  // Mood Streak
  let streak = 1;
  let maxStreak = 1;
  for (let i = 1; i < entries.length; i++) {
    const prev = new Date(entries[i - 1].date);
    const current = new Date(entries[i].date);
    const diff = Math.floor(
      (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 1) {
      streak += 1;
      maxStreak = Math.max(maxStreak, streak);
    } else if (diff > 1) {
      streak = 1;
    }
  }

  // Mood Shifts: count how many times the mood changes drastically
  // A shift of 2 or more on the mood scale is considered major
  let majorShifts = 0;
  for (let i = 1; i < entries.length; i++) {
    const prevIndex = MOOD_ORDER.indexOf(entries[i - 1].mood);
    const currentIndex = MOOD_ORDER.indexOf(entries[i].mood);
    if (Math.abs(currentIndex - prevIndex) >= 2) {
      majorShifts += 1;
    }
  }

  const messageLines = [
    `Most Common Mood: ${capitalize(mostCommonMood)}`,
    `Mood Streak: ${maxStreak} days logged in a row`,
    `Mood Shifts: ${majorShifts} major shifts this week`,
  ];

  return { messageLines };
};

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const MoodTrackerService = {
  createMoonTracker,
  getMyMoodTracker,
  getTrackMessage,
};
