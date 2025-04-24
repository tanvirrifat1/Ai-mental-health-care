import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { QuestionAndAnsController } from './questionAnsAns.controller';

const router = express.Router();

router.post(
  '/create-chat',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  QuestionAndAnsController.createChat,
);

export const QuestionAndAnsRoutes = router;
