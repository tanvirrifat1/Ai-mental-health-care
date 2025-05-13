import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { MsiTestController } from './msiTest.controller';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER),
  MsiTestController.createMsiBpdTest,
);

router.get('/get-all', auth(USER_ROLES.USER), MsiTestController.getMsiBpdTest);

export const MsiTestRoutes = router;
