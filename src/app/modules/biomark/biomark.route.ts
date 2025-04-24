import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { BiomarkController } from './biomark.controller';

const router = express.Router();

router.post(
  '/create-biamark',
  auth(USER_ROLES.USER),
  BiomarkController.createBiamark,
);

export const BiomarkRoutes = router;
