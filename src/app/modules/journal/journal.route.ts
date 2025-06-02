import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { JournalController } from './journal.controller';
import { journalZodSchema } from './journal.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER),

  JournalController.createJournal,
);

router.get(
  '/get-journal',
  auth(USER_ROLES.USER),
  JournalController.getMyJournal,
);

router.get(
  '/get-details/:id',
  auth(USER_ROLES.USER),
  JournalController.getDetails,
);

router.post(
  '/download-journal/:id',
  auth(USER_ROLES.USER),
  JournalController.downloadJournalPdf,
);

export const JournalRoutes = router;
