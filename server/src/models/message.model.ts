import mongoose, { Schema, Document, Types } from 'mongoose';

interface IMessage extends Document {
  message: string;
  senderId: Types.ObjectId;
  receiverId:Types.ObjectId;
  image?:string;
}

const MessageSchema: Schema = new Schema<IMessage>(
  {
    message: {
      type: String,
    },
    senderId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
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