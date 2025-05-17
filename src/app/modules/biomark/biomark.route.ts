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

router.post(
  '/create-biomarkers-extra',
  auth(USER_ROLES.USER),
  BiomarkController.createBiamarkExtra,
);

router.get(
  '/get-pending-biomarkers',
  auth(USER_ROLES.USER),
  BiomarkController.getPendingBiomarks,
);

router.get(
  '/get-updated-biomarkers',
  auth(USER_ROLES.USER),
  BiomarkController.getUpdatedBiomarks,
);

router.post(
  '/upload-biomarkers',
  auth(USER_ROLES.USER),
  BiomarkController.uploadBiomarks,
);

export const BiomarkRoutes = router;
