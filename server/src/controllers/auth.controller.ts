import { Request, Response, CookieOptions } from 'express';
import User from '../models/user.model';
import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler';

export interface CustomRequest extends Request {
  user?: {
    _id: string | ObjectId;
  };
}

import {
  loginValidationSchema,
  requestResetPasswordSchema,
  ResetPasswordSchema,
  signUpvalidationSchema,
} from '../validation/validationSchema';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import uploadOnCloudinary from '../utils/Cloudinary';
import { ObjectId } from 'mongoose';

const generateAccessAndRefreshToken = async (
  _id: ObjectId
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Error while generating access and refresh token');
  }
};

export const userSignUp = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = signUpvalidationSchema.safeParse(req.body);

  //step -1 check for user input validation
  if (!validationResult.success) {
    throw new ApiError(
      400,
      'Invalid User Input Schema',
      validationResult.error.errors
    );
  }

  const { username, email, password } = validationResult.data;

  //step 2 - check that if user already exist or not

  const isUserExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExist) {
    throw new ApiError(409, 'User already exist');
  }

  // Step 3: Handle avatar and cover image file uploads

  const localAvatarPath = req.file?.path;

  if (!localAvatarPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  //upload image to cloudinary
  const avatar = await uploadOnCloudinary(localAvatarPath);

  if (!avatar) {
    throw new ApiError(500, 'Error uploading avatar file');
  }

  // Step 5: Create and save the user
  const newUser = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    avatar: avatar.url,
  });

  // Step 6: Remove sensitive fields for the response
  const createdUser = await User.findById(newUser._id).select(
    '-password -refreshToken -resetPasswordToken -resetPasswordExpires'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Error while creating user');
  }

  // Step 7: Return response
  res
    .status(201)
    .json(new ApiResponse(201, 'User created successfully', createdUser));
});

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = loginValidationSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new ApiError(
      400,
      'Invalid User Input Schema',
      validationResult.error.errors
    );
  }

  const { email, password } = validationResult.data;

  if (!email) {
    throw new ApiError(409, 'email is required');
  }

  if (!password) {
    throw new ApiError(409, 'Password is required');
  }

  // Step 2: Check if user exists in the database
  const userExist = await User.findOne({
    email,
  });

  if (!userExist) {
    throw new ApiError(409, 'User does not exist. Please signup first');
  }

  // Step 3: Check if the password is correct
  const isPasswordCorrect: boolean = await userExist.isPasswordValid(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Password is incorrect');
  }

  // Step 4 : generate access and refresh tokens

  const tokenResult = await generateAccessAndRefreshToken(
    userExist._id as ObjectId
  );

  const { accessToken, refreshToken } = tokenResult;

  const userResponse = await User.findById(userExist._id).select(
    '-password -refreshToken'
  );

  if (!userResponse) {
    throw new ApiError(500, 'Error while fetching user data');
  }

  interface Ioptions {
    secure: boolean;
    httpOnly: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }

  const options: Ioptions = {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  };

  // Step 6: Return response
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, 'Login successful', {
        accessToken,
        refreshToken,
        user: userResponse.toObject({
          getters: true,
          virtuals: false,
          versionKey: false,
        }),
      })
    );
});

export const userLogout = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const UserId: string | ObjectId | undefined = req.user?._id;

    if (!UserId) {
      throw new ApiError(401, 'User Id not found');
    }

    await User.findByIdAndUpdate(
      UserId,
      {
        $set: {
          refreshToken: null,
        },
      },
      { new: true }
    );

    const options: CookieOptions = {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    };

    return res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json(new ApiResponse(200, 'User Logged Out', {}));
  }
);
