import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'

interface IUser extends Document {
  username: string;
  password: string;
  email:string;
  avatar:string;
  refreshToken:string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  generatePasswordResetToken : ()=>string;
  generateRefreshToken : () =>string;
  generateAccessToken : () =>string;
  isPasswordValid(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar:{
      type:String,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, 
    }
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err instanceof Error ? err : new Error(String(err)));
  }
});

userSchema.methods.isPasswordValid = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;