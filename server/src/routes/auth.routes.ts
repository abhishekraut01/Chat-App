import express from 'express';
import {
  userLogin,
  userLogout,
  userSignUp,
} from '../controllers/auth.controller';
import upload from '../middlewares/multer.middleware';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

// 👤 User authentication routes
router.route('/signup').post(upload.single('avatar'), userSignUp);
router.route('/login').post(userLogin);
router.route('/logout').post(authMiddleware, userLogout);

export default router;