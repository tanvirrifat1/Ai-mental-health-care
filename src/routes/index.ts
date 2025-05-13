import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { BiomarkRoutes } from '../app/modules/biomark/biomark.route';
import { PsychologicalNameRoutes } from '../app/modules/psychologicalName/psychologicalName.route';
import { QuestionAndAnsRoutes } from '../app/modules/questionAnsAns/questionAnsAns.route';
import { ChatRoomRoutes } from '../app/modules/chatRoom/chatRoom.route';
import { MoodTrackerRoutes } from '../app/modules/moodTracker/moodTracker.route';
import { SettingRoutes } from '../app/modules/setting/setting.route';
import { JournalRoutes } from '../app/modules/journal/journal.route';
import { TestBiomarkersRoutes } from '../app/modules/testBiomarkers/testBiomarkers.route';
import { Dass21Routes } from '../app/modules/dass21/dass21.route';
import { Gad7TestRoutes } from '../app/modules/gad7Test/gad7Test.route';
import { BprsRoutes } from '../app/modules/bprs/bprs.route';
import { AceTestRoutes } from '../app/modules/aceTest/aceTest.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/biomarkers', route: BiomarkRoutes },
  { path: '/psychological-name', route: PsychologicalNameRoutes },
  { path: '/question-ans', route: QuestionAndAnsRoutes },
  { path: '/chat-room', route: ChatRoomRoutes },
  { path: '/mood-tracker', route: MoodTrackerRoutes },
  { path: '/setting', route: SettingRoutes },
  { path: '/journal', route: JournalRoutes },
  { path: '/test-biomarkers', route: TestBiomarkersRoutes },
  { path: '/dass21', route: Dass21Routes },
  { path: '/gad7-test', route: Gad7TestRoutes },
  { path: '/bprs', route: BprsRoutes },
  { path: '/ace-test', route: AceTestRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
