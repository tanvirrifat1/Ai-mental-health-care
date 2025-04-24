import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { biomarkSchema } from './biomark.validation';
import { BiomarkController } from './biomark.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-biamark',
  auth(USER_ROLES.INFLUENCER),
  BiomarkController.createBiamark,
);

export const BiomarkRoutes = router;
