import express from 'express';
import {
  userLogin,
  userLogout,
  userSignUp,
} from '../controllers/auth.controller';

import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/signup').post(userSignUp);
router.route('/login').post(userLogin);
router.route('/logout').post(authMiddleware, userLogout);

export default router;