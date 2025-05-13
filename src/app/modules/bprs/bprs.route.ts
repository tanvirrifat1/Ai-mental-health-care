import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BprsController } from './bprs.controller';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), BprsController.createBprs);

export const BprsRoutes = router;
