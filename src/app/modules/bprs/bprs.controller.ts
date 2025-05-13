import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { bprsService } from './bprs.service';

const createBprs = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const value = {
    ...req.body,
    userId,
  };

  const result = await bprsService.createBprs(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Bprs created successfully',
    data: result,
  });
});

export const BprsController = {
  createBprs,
};
