import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { Dass21Controller } from './dass21.controller';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), Dass21Controller.createDass21);

router.get('/get-all', auth(USER_ROLES.USER), Dass21Controller.getAllDass21);

router.get(
  '/get-result-with-ai',
  auth(USER_ROLES.USER),
  Dass21Controller.getResultWithAi,
);

export const Dass21Routes = router;
