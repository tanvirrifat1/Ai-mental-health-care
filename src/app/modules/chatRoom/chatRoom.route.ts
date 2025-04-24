import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ChatRoomController } from './chatRoom.controller';

const router = express.Router();

router.get(
  '/get-all',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  ChatRoomController.getAllChatRoom,
);

export const ChatRoomRoutes = router;
