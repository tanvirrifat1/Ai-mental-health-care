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

export const MsiTestRoutes = router;
