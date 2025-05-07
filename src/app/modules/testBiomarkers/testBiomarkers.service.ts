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

export const TestBiomarkersService = {
  createTestBiomarkers,
};
