import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { Dass21Controller } from './dass21.controller';

const router = express.Router();

router.post('/create', auth(USER_ROLES.USER), Dass21Controller.createDass21);

export const Dass21Routes = router;
