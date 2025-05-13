import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { AceTestController } from './aceTest.controller';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), AceTestController.createAceTest);

export const AceTestRoutes = router;
