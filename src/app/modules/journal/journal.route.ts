import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { JournalController } from './journal.controller';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), JournalController.createJournal);

router.get(
  '/get-journal',
  auth(USER_ROLES.USER),
  JournalController.getMyJournal,
);

router.get(
  '/get-detail/:id',
  auth(USER_ROLES.USER),
  JournalController.getDetail,
);

export const JournalRoutes = router;
