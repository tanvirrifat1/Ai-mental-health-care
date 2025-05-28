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

const biomarkerTest = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId,
  };

  const result = await BiomarkService.biomarkerTest(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Biomark test send successfully',
    data: result,
  });
});

const createBiamarkExtra = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId,
  };

  const result = await BiomarkService.createBiamarkExtra(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Biomark created successfully',
    data: result,
  });
});

const getPendingBiomarks = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await BiomarkService.getPendingBiomarks(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Biomark retrived successfully',
    data: result,
  });
});

const getUpdatedBiomarks = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await BiomarkService.getUpdatedBiomarks(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Biomark retrived successfully',
    data: result,
  });
});

const uploadBiomarks = catchAsync(async (req, res) => {
  const { selectedIds } = req.body;

  const result = await BiomarkService.uploadBiomarks(selectedIds);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Biomarkers uploaded successfully',
    data: result,
  });
});

export const BiomarkController = {
  createBiamark,
  getPendingBiomarks,
  uploadBiomarks,
  getUpdatedBiomarks,
  createBiamarkExtra,
  biomarkerTest,
};
