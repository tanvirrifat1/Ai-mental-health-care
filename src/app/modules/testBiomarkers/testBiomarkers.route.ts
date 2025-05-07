import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { TestBiomarkersController } from './testBiomarkers.controller';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER),
  TestBiomarkersController.createTestBiomarkers,
);

export const TestBiomarkersRoutes = router;
