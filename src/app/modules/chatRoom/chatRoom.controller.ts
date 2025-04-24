import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatRoomService } from './chatRoom.service';

const getAllChatRoom = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await ChatRoomService.getAllChatRoom(req.query, userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'ChatRoom retrived successfully',
    data: result,
  });
});

export const ChatRoomController = {
  getAllChatRoom,
};
