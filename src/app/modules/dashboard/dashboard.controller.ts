import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { dashboardService } from './dashboard.service';

const totalStatistics = catchAsync(async (req, res) => {
  const result = await dashboardService.totalStatistics();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'total statistics successfully',
    data: result,
  });
});

export const DashboardController = {
  totalStatistics,
};
