import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { AceTestController } from './aceTest.controller';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), AceTestController.createAceTest);

router.get('/get-all', auth(USER_ROLES.USER), AceTestController.getAceTest);

export const AceTestRoutes = router;
