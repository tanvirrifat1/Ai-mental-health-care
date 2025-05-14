import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { aceTestService } from './aceTest.service';

const createAceTest = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const value = {
    ...req.body,
    userId,
  };

  const result = await aceTestService.createAceTest(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'AceTest created successfully',
    data: result,
  });
});

const getAceTest = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await aceTestService.getAceTest(userId, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'AceTest retrieved successfully',
    data: result,
  });
});

const getResultWithAi = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await aceTestService.getResultWithAi(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'AceTest retrieved Ai successfully',
    data: result,
  });
});

export const AceTestController = {
  createAceTest,
  getAceTest,
  getResultWithAi,
};
