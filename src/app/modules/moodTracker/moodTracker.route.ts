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

router.get(
  '/get-track-message',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  MoodTrackerController.getTrackMessage,
);

router.get(
  '/get-feed-back-with-ai',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  MoodTrackerController.getFeedBackWithAi,
);

export const MoodTrackerRoutes = router;
