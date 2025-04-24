import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { PsychologicalTestController } from './psychologicalName.controller';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.ADMIN),
  PsychologicalTestController.psychologicalFromDB,
);

router.get('/get', PsychologicalTestController.getPsychologicalFromDB);

export const PsychologicalNameRoutes = router;
