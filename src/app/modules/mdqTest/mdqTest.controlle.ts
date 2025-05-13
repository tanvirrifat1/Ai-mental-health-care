import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { mdqService } from './mdqTest.service';

const createGad7Test = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const value = {
    ...req.body,
    userId,
  };

  const result = await mdqService.createMdqTest(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Gad7Test created successfully',
    data: result,
  });
});

export const MdqTestController = {
  createGad7Test,
};
