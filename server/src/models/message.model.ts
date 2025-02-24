import mongoose, { Schema, Document, Types } from 'mongoose';

interface IMessage extends Document {
  message: string;
  senderId: Types.ObjectId;
  recieverId:Types.ObjectId;
  image?:string;
}

const MessageSchema: Schema = new Schema<IMessage>(
  {
    message: {
      type: String,
    },
    senderId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    recieverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
    image: {
      type: String,
      default:""
    }
  },
  { timestamps: true }
);
  

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;