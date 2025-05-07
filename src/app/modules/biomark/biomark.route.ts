import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { BiomarkController } from './biomark.controller';

const router = express.Router();

router.post(
  '/create-biomarkers',
  auth(USER_ROLES.USER),
  BiomarkController.createBiamark,
);

router.get(
  '/get-pending-biomarkers',
  auth(USER_ROLES.USER),
  BiomarkController.getPendingBiomarks,
);

router.post(
  '/upload-biomarkers',
  auth(USER_ROLES.USER),
  BiomarkController.uploadBiomarks,
);

export const BiomarkRoutes = router;
