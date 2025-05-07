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

export const JournalController = {
  createJournal,
};
