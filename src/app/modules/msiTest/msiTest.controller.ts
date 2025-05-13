import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { msiTestService } from './msiTest.service';

const createMsiBpdTest = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const value = {
    ...req.body,
    userId,
  };

  const result = await msiTestService.createMsiBpdTest(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'MsiBpdTest created successfully',
    data: result,
  });
});

export const MsiTestController = {
  createMsiBpdTest,
};
