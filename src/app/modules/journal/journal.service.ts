import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IJournal } from './journal.interface';
import { Journal } from './journal.model';
import { generateJournalHTML } from './journal.template';
import pdf from 'html-pdf';
import fs from 'fs/promises';
import { Types } from 'mongoose';
import path from 'path';

// const createJournal = async (
//   data: Record<string, any> | IJournal | IJournal[],
// ) => {
//   let journalToInsert: IJournal[];

//   if (
//     'title' in data &&
//     'description' in data &&
//     'userId' in data &&
//     'date' in data &&
//     'type' in data &&
//     'heading' in data
//   ) {
//     journalToInsert = [
//       {
//         ...data,
//         date: data.date || new Date(),
//       } as IJournal,
//     ];
//   } else if (Array.isArray(data)) {
//     journalToInsert = data.map(entry => ({
//       ...entry,
//       date: entry.date || new Date(),
//     }));
//   } else {
//     const typedData = data as Record<string, any>;
//     const userId = typedData.userId;
//     const date = typedData.date || new Date();

//     journalToInsert = Object.keys(typedData)
//       .filter(key => !isNaN(Number(key)))
//       .map(key => ({
//         ...typedData[key],
//         ...(userId && { userId }),
//         date,
//       }));
//   }

//   const result = await Journal.insertMany(journalToInsert);
//   return result;
// };

const createJournal = async (data: IJournal) => {
  const date = data.date || new Date();
  data.date = date;

  const result = await Journal.create(data);

  const pdf = await getDetails(result._id);

  const filePath = path.join(
    process.cwd(),
    'uploads',
    'docs',
    `${result._id}.pdf`,
  );

  await fs.writeFile(filePath, pdf as Buffer);

  result.docs = '/docs/' + result._id + '.pdf';

  return result.save();
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

const getDetails = async (id: string | Types.ObjectId) => {
  return new Promise(async (resolve, reject) => {
    const exist = await Journal.findById(id);

    if (!exist) {
      reject(new ApiError(StatusCodes.NOT_FOUND, 'Journal not found'));
    }

    const template = generateJournalHTML(exist);

    pdf
      .create(template, { format: 'A4', border: '10mm' })
      .toBuffer((err, buffer) => {
        if (err) {
          reject(new ApiError(StatusCodes.NOT_FOUND, 'Journal not found'));
        } else {
          resolve(buffer);
        }
      });
  });
};

const getDetail = async (id: string | Types.ObjectId) => {
  const exist = await Journal.findById(id);
  if (!exist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Journal not found');
  }

  return exist;
};

export const JournalService = {
  createJournal,
  getMyJournal,
  getDetails,
  getDetail,
};
