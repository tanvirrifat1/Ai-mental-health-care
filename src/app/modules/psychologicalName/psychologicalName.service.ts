import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPsychologicalTest } from './psychologicalName.interface';
import { PsychologicalTest } from './psychologicalName.model';

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

const getPsychologicalFromDB = async () => {
  const result = await PsychologicalTest.find({});
  return result;
};

export const PsychologicalTestService = {
  psychologicalFromDB,
  getPsychologicalFromDB,
};
