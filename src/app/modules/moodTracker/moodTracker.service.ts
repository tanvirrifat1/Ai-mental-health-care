import { Types } from 'mongoose';
import { IMoodTracker } from './moodTracker.interface';
import { MoodTracker } from './moodTracker.model';
import { startOfDay, subDays } from 'date-fns';

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

export const MoodTrackerService = {
  createMoonTracker,
  getMyMoodTracker,
};
