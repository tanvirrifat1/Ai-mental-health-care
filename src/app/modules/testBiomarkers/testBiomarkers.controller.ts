import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TestBiomarkersService } from './testBiomarkers.service';

const createTestBiomarkers = catchAsync(async (req, res) => {
  const userId: string = req.user.id;

  const value = {
    ...req.body,
    userId,
  };

  const result = await TestBiomarkersService.createTestBiomarkers(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Test Biomarkers created successfully',
    data: result,
  });
});

export const TestBiomarkersController = {
  createTestBiomarkers,
};
