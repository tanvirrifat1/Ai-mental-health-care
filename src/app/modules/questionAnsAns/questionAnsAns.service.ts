import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import openai from '../../../shared/openAI';
import { Room } from '../chatRoom/chatRoom.model';
import { IQuestionAndAns } from './questionAnsAns.interface';
import { QuestionAndAns } from './questionAnsAns.model';

// const createChat = async (payload: IQuestionAndAns) => {
//   let room;
//   let isMentalHealthRelated = true;

//   // Step 1: Determine the room to use or create a new one
//   if (payload.room) {
//     room = await Room.findOne({ roomName: payload.room });
//     if (!room) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
//     }
//   } else if (!payload.createRoom) {
//     room = await Room.findOne({ user: payload.user }).sort({ createdAt: -1 });
//   }

//   // Step 2: If no existing room or user requested a new room, validate question
//   if (!room || payload.createRoom) {
//     const checkResult = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: [
//         {
//           role: 'system',
//           content:
//             'Determine if the user\'s question is related to mental health. Respond only with "yes" or "no".',
//         },
//         { role: 'user', content: payload.question },
//       ],
//     });

//     const check = checkResult.choices[0].message?.content?.trim().toLowerCase();
//     if (check !== 'yes') {
//       return 'I can only answer questions related to mental health.';
//     }

//     // Create room since it's valid
//     const formattedDate = moment().format('HH:mm:ss');
//     room = await Room.create({
//       user: payload.user,
//       roomName: payload.question + ' ' + formattedDate,
//     });
//   }

//   // Step 3: Get previous chat messages
//   const previousChats = await QuestionAndAns.find({ room: room._id })
//     .sort({ createdAt: 1 })
//     .select('question answer');

//   // Step 4: Prepare message context
//   const messages = [
//     {
//       role: 'system',
//       content:
//         "You are a compassionate AI assistant specializing in mental health support. Answer the user's mental health-related questions using the context below.",
//     },
//     ...previousChats.flatMap(chat => [
//       { role: 'user', content: chat.question },
//       { role: 'assistant', content: chat.answer },
//     ]),
//     { role: 'user', content: payload.question },
//   ];

//   // Step 5: Get GPT response
//   const result = await openai.chat.completions.create({
//     model: 'gpt-4',
//     messages: messages as any,
//   });

//   const answer = result.choices[0].message?.content;

//   // Step 6: Save new Q&A
//   const value = {
//     question: payload.question,
//     answer: answer,
//     room: room._id,
//     user: payload.user,
//     createRoom: payload.createRoom,
//   };

//   const res = await QuestionAndAns.create(value);
//   return res;
// };

const createChat = async (payload: IQuestionAndAns) => {
  let room;

  if (payload.roomId) {
    room = await Room.findById(payload.roomId);
    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
    }
  }

  if (!room || payload.createRoom === true) {
    room = await Room.create({
      user: payload.user,
      roomName: payload.question,
    });
  }

  const previousQA = await QuestionAndAns.find({ roomId: room._id }).sort({
    createdAt: 1,
  });

  const historyMessages = previousQA.flatMap(item => [
    { role: 'user', content: item.question },
    { role: 'assistant', content: item.answer || '' },
  ]);

  // System prompt strictly limiting to mental health domain
  const messages: any = [
    {
      role: 'system',
      content:
        `You are a helpful AI assistant specialized in mental health support. ` +
        `Answer all user questions strictly in the context of mental health, mental wellness, ` +
        `emotional support, coping strategies, therapy, and psychological advice. ` +
        `Do not provide answers outside the mental health domain.`,
    },
    ...historyMessages,
    { role: 'user', content: payload.question },
  ];

  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
  });

  const answer = result.choices[0].message?.content;

  const value = {
    question: payload.question,
    answer: answer,
    roomId: room._id,
    user: payload.user,
    createRoom: payload.createRoom,
  };

  const res = await QuestionAndAns.create(value);

  return res;
};

const getQuestionAndAns = async (
  query: Record<string, unknown>,
  roomId: string,
) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const anyConditions: any[] = [];

  anyConditions.push({ roomId });

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value }),
    );
    anyConditions.push({ $and: filterConditions });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await QuestionAndAns.find(whereConditions)
    .populate({
      path: 'roomId',
      select: 'roomName',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await QuestionAndAns.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const QuestionAndAnsService = {
  createChat,
  getQuestionAndAns,
};
