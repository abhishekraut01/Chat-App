import express from 'express';
import {
  getAllUser,
  getChatsById,
  sendMessage
} from '../controllers/message.controller';

import authMiddleware from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';

const router = express.Router();


router.route('/getUsersInChat').get(authMiddleware, getAllUser);
router.route('/:id').get(authMiddleware, getChatsById);
router.route('/:id').post(authMiddleware,upload.single('image') ,sendMessage);


export default router;