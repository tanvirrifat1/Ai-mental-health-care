import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PsychologicalTestService } from './psychologicalTest.service';

const psychologicalFromDB = catchAsync(async (req, res) => {
  const result = await PsychologicalTestService.psychologicalFromDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Psychological Test created successfully',
    data: result,
  });
});

export const PsychologicalTestController = {
  psychologicalFromDB,
};
