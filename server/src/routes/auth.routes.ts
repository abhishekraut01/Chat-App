import express from 'express';
import {
  getUser,
  updateProfile,
  userLogin,
  userLogout,
  userSignUp,
} from '../controllers/auth.controller';

import authMiddleware from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';

const router = express.Router();

router.route('/signup').post(userSignUp);
router.route('/login').post(userLogin);
router.route('/logout').post(authMiddleware, userLogout);
router.route('/getuser').get(authMiddleware, getUser);


router.route('/updateProfile').patch(authMiddleware, upload.single("avatar"), updateProfile);



export default router;