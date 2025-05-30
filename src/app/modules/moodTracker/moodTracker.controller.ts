import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MoodTrackerService } from './moodTracker.service';

const createMoonTracker = catchAsync(async (req, res) => {
  const user = req.user.id;
  const value = {
    ...req.body,
    user,
  };

  const result = await MoodTrackerService.createMoonTracker(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'MoonTracker created successfully',
    data: result,
  });
});

const getMyMoodTracker = catchAsync(async (req, res) => {
  const user = req.user.id;

  const result = await MoodTrackerService.getMyMoodTracker(user, req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'MoonTracker retrieved successfully',
    data: result,
  });
});

const getTrackMessage = catchAsync(async (req, res) => {
  const user = req.user.id;

  const result = await MoodTrackerService.getTrackMessage(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'MoonTracker retrieved successfully',
    data: result,
  });
});

const getFeedBackWithAi = catchAsync(async (req, res) => {
  const user = req.user.id;

  const result = await MoodTrackerService.getFeedBackWithAi(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'MoonTracker feedback retrieved successfully',
    data: result,
  });
});

export const MoodTrackerController = {
  createMoonTracker,
  getMyMoodTracker,
  getTrackMessage,
  getFeedBackWithAi,
};
