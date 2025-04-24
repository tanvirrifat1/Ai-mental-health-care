import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BiomarkService } from './biomark.service';

const createBiamark = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId,
  };

  const result = await BiomarkService.createBiamark(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Biomark created successfully',
    data: result,
  });
});

export const BiomarkController = {
  createBiamark,
};
