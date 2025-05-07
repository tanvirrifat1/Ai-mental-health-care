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
  const { page, limit, searchTerm, type, ...filterData } = query;

  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  if (type) {
    conditions.push({ type });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      }),
    );
    conditions.push({ $and: filterConditions });
  }

  conditions.push({ userId });

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first

  const result = await Journal.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Journal.countDocuments();

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

export const JournalService = {
  createJournal,
  getMyJournal,
};
