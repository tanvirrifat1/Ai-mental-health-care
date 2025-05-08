import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Biomark } from '../biomark/biomark.model';
import { ITestBiomarkers } from './testBiomarkers.interface';
import { TestBiomarkers } from './testBiomarkers.model';

const createTestBiomarkers = async (data: ITestBiomarkers) => {
  const biomarkerExists = await Biomark.exists({ _id: data.biomarkerId });
  if (!biomarkerExists) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Biomarker not found');
  }

  const createdTest = await TestBiomarkers.create(data);

  await Biomark.updateOne(
    { _id: data.biomarkerId },
    { $set: { isTest: true } },
  );

  return createdTest;
};

const getMyTestBiomarkers = async (userId: string) => {
  const latestEntry: any = await TestBiomarkers.findOne({ userId })
    .sort({ updatedAt: -1 })
    .select('updatedAt');

  if (!latestEntry) return [];

  const latestDate = new Date(latestEntry.updatedAt);

  latestDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(latestDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const result = await TestBiomarkers.find({
    userId,
    updatedAt: { $gte: latestDate, $lt: nextDay },
  });

  return result;
};

export const TestBiomarkersService = {
  createTestBiomarkers,
  getMyTestBiomarkers,
};
