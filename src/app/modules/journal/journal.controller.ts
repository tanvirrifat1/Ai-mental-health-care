import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { JournalService } from './journal.service';
import { Request, Response } from 'express';
import { Journal } from './journal.model';
import { generateJournalPdf } from './journa.constant';

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

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Journal retrived successfully',
    data: result,
  });
});

const downloadJournalPdf = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  const journal = await Journal.findById(id);
  if (!journal) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Journal not found' });
    return;
  }

  const pdfBytes = await generateJournalPdf(journal);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="journal-${id}.pdf"`,
  );
  res.send(Buffer.from(pdfBytes));
};

export const JournalController = {
  createJournal,
  getMyJournal,
  getDetails,
  downloadJournalPdf,
};
