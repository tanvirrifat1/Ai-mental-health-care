import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPsychologicalTest } from './psychologicalTest.interface';
import { PsychologicalTest } from './psychologicalTest.model';

const psychologicalFromDB = async (data: IPsychologicalTest) => {
  const isExist = await PsychologicalTest.findOne({ title: data.title });
  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Psychological Test already exist!',
    );
  }
  const psychologicalTest = await PsychologicalTest.create(data);
  return psychologicalTest;
};

export const PsychologicalTestService = {
  psychologicalFromDB,
};
