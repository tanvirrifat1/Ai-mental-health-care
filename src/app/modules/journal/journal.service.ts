import { IJournal } from './journal.interface';
import { Journal } from './journal.model';

const createJournal = async (data: IJournal) => {
  const date = new Date();

  const value = {
    ...data,
    date: date,
  };

  const result = await Journal.create(value);
  return result;
};

const getMyJournal = async (userId: string, query: any) => {
  const { page = '1', limit = '10', searchTerm, type, ...filterData } = query;

  const conditions: Record<string, any>[] = [];

  // Search term handling
  if (searchTerm) {
    const orConditions: Record<string, any>[] = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ];

    const parsedDate = new Date(searchTerm);
    if (!isNaN(parsedDate.getTime())) {
      const start = new Date(parsedDate.setHours(0, 0, 0, 0));
      const end = new Date(parsedDate.setHours(23, 59, 59, 999));
      orConditions.push({ date: { $gte: start, $lte: end } });
    }

    conditions.push({ $or: orConditions });
  }

  // Type filter
  if (type) {
    conditions.push({ type });
  }

  // Additional filters
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  // Add user filter
  conditions.push({ userId });

  const filterQuery = conditions.length ? { $and: conditions } : {};

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const [result, total] = await Promise.all([
    Journal.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Journal.countDocuments(filterQuery),
  ]);

  return {
    result,
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
    },
  };
};

export const JournalService = {
  createJournal,
  getMyJournal,
};
