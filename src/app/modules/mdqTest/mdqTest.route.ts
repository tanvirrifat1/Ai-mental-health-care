import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { MdqTestController } from './mdqTest.controlle';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), MdqTestController.createGad7Test);

export const MdqTestRoutes = router;
