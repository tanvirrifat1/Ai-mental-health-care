import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { MoodTrackerController } from './moodTracker.controller';
import validateRequest from '../../middlewares/validateRequest';
import { moodTrackerZodSchema } from './moodTracker.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  validateRequest(moodTrackerZodSchema),
  MoodTrackerController.createMoonTracker,
);

router.get(
  '/get-mood-tracker',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  MoodTrackerController.getMyMoodTracker,
);

export const MoodTrackerRoutes = router;
