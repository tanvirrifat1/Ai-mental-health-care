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

router.post('/send-auto-mail', TestBiomarkersController.sendAutoMail);

router.get(
  '/get-details/:biomarkerId',
  auth(USER_ROLES.USER),
  TestBiomarkersController.getDetails,
);

router.get(
  '/get-test-history',
  auth(USER_ROLES.USER),
  TestBiomarkersController.getAllTestHistory,
);

export const TestBiomarkersRoutes = router;
