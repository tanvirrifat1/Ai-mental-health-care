import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Dass21Service } from './dass21.service';

const createDass21 = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const value = {
    ...req.body,
    userId,
  };
  const result = await Dass21Service.createDass21(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dass21 created successfully',
    data: result,
  });
});

const getAllDass21 = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await Dass21Service.getAllDass21(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dass21 retrieved successfully',
    data: result,
  });
});

export const Dass21Controller = {
  createDass21,
  getAllDass21,
};
