import { model, Schema } from 'mongoose';
import { IChatRoom } from './chatRoom.interface';

const chatRoomSchema = new Schema<IChatRoom>(
  {
    roomName: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

export const ChatRoom = model<IChatRoom>('ChatRoom', chatRoomSchema);
