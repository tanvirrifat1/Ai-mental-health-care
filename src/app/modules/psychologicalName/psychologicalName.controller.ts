import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PsychologicalTestService } from './psychologicalName.service';

const psychologicalFromDB = catchAsync(async (req, res) => {
  const result = await PsychologicalTestService.psychologicalFromDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Psychological name created successfully',
    data: result,
  });
});

const getPsychologicalFromDB = catchAsync(async (req, res) => {
  const result = await PsychologicalTestService.getPsychologicalFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Psychological name retrieved successfully',
    data: result,
  });
});

export const PsychologicalTestController = {
  psychologicalFromDB,
  getPsychologicalFromDB,
};
