import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Biomark } from '../biomark/biomark.model';
import { ITestBiomarkers } from './testBiomarkers.interface';
import { TestBiomarkers } from './testBiomarkers.model';

const createTestBiomarkers = async (data: ITestBiomarkers) => {
  const isExist = await Biomark.findById(data.biomarkerId);
  if (!isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Biomarker not found');
  }

  const result = await TestBiomarkers.create(data);
  return result;
};

export const TestBiomarkersService = {
  createTestBiomarkers,
};
