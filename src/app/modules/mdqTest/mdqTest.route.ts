import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { MdqTestController } from './mdqTest.controlle';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), MdqTestController.createGad7Test);

router.get('/get-all', auth(USER_ROLES.USER), MdqTestController.getMdqTest);
router.get(
  '/get-result-with-ai',
  auth(USER_ROLES.USER),
  MdqTestController.getMdqResultWithAi,
);

export const MdqTestRoutes = router;
