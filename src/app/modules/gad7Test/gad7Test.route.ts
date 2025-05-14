import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { Gad7TestController } from './gad7Test.controller';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER),
  Gad7TestController.createGad7Test,
);

router.get('/get-all', auth(USER_ROLES.USER), Gad7TestController.getGad7Test);

router.get(
  '/get-result-with-ai',
  auth(USER_ROLES.USER),
  Gad7TestController.getGad7ResultWithAi,
);

export const Gad7TestRoutes = router;
