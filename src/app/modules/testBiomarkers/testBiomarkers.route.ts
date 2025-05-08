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

router.get(
  '/get-test-biomarkers',
  auth(USER_ROLES.USER),
  TestBiomarkersController.getMyTestBiomarkers,
);

export const TestBiomarkersRoutes = router;
