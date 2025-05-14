import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Gad7TestService } from './gad7Test.service';

const createGad7Test = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const value = {
    ...req.body,
    userId,
  };

  const result = await Gad7TestService.createGad7Test(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Gad7Test created successfully',
    data: result,
  });
});

const getGad7Test = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await Gad7TestService.getGad7Test(userId, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Gad7Test retrieved successfully',
    data: result,
  });
});

const getGad7ResultWithAi = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await Gad7TestService.getGad7ResultWithAi(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Gad7Test retrieved AI successfully',
    data: result,
  });
});

export const Gad7TestController = {
  createGad7Test,
  getGad7Test,
  getGad7ResultWithAi,
};
