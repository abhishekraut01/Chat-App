import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { CustomRequest } from './auth.controller';
import ApiError from '../utils/ApiError';
import User from '../models/user.model';
import ApiResponse from '../utils/ApiResponse';
import Message from '../models/message.model';
import mongoose from 'mongoose';

export const getAllUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, 'You are not authenticated');
    }

    const filteredUser = await User.find({ _id: { $ne: userId } });

    if (filteredUser.length === 0) {
      throw new ApiError(401, 'Users not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, 'User data fetched', filteredUser));
  }
);

export const getChatsById = asyncHandler(async (req: CustomRequest, res: Response) => {
    const userToChatId = req.params.id;
    const userId = req.user?._id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
        throw new ApiError(400, "Invalid Chat ID");
    }

    if (!userId) {
        throw new ApiError(401, "You are not authenticated");
    }

    // Fetch messages between the two users
    const messages = await Message.find({
        $or: [
            { senderId: userId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: userId }
        ]
    }).sort({ createdAt: 1 });
    
    if (!messages.length) {
        throw new ApiError(404, "No messages found between these users");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Chat messages fetched successfully", messages));
});
