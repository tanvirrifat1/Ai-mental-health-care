import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { JournalService } from './journal.service';

const createJournal = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const value = {
    ...req.body,
    userId,
  };

  const result = await JournalService.createJournal(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Journal created successfully',
    data: result,
  });
});

const getMyJournal = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await JournalService.getMyJournal(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Journal retrived successfully',
    data: result,
  });
});

const getDetails = catchAsync(async (req, res) => {
  const result = await JournalService.getDetails(req.params.id);

  res.contentType('application/pdf');
  res.send(result);
});

const getDetail = catchAsync(async (req, res) => {
  const result = await JournalService.getDetail(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Journal retrived successfully',
    data: result,
  });
});

export const JournalController = {
  createJournal,
  getMyJournal,
  getDetails,
  getDetail,
};
