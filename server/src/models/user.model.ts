import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
interface IUser extends Document {
  username: string;
  password: string;
  email:string;
  avatar?:string;
  generateAccessToken() : string
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
      default:""
    },
    password: {
      type: String,
      required: true,
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

userSchema.methods.generateAccessToken = async function () {
    const secret = process.env.ACCESS_TOKEN_SECRET ;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
    }
  
    return jwt.sign(
      {
        _id: this._id,
      },
      secret,
      { expiresIn: "1d" }
    );
  };
  

const User = mongoose.model<IUser>('User', userSchema);
export default User;