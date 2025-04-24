import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { BiomarkRoutes } from '../app/modules/biomark/biomark.route';
import { PsychologicalNameRoutes } from '../app/modules/psychologicalName/psychologicalName.route';
import { QuestionAndAnsRoutes } from '../app/modules/questionAnsAns/questionAnsAns.route';
import { ChatRoomRoutes } from '../app/modules/chatRoom/chatRoom.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/biomark', route: BiomarkRoutes },
  { path: '/psychological-name', route: PsychologicalNameRoutes },
  { path: '/question-ans', route: QuestionAndAnsRoutes },
  { path: '/chat-room', route: ChatRoomRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
