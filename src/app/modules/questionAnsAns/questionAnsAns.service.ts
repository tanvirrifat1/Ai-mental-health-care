import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import openai from '../../../shared/openAI';
import { Room } from '../chatRoom/chatRoom.model';
import { IQuestionAndAns } from './questionAnsAns.interface';
import moment from 'moment';
import { QuestionAndAns } from './questionAnsAns.model';

const createChat = async (payload: IQuestionAndAns) => {
  let room;
  let isMentalHealthRelated = true;

  // Step 1: Determine the room to use or create a new one
  if (payload.room) {
    room = await Room.findOne({ roomName: payload.room });
    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found!');
    }
  } else if (!payload.createRoom) {
    room = await Room.findOne({ user: payload.user }).sort({ createdAt: -1 });
  }

  // Step 2: If no existing room or user requested a new room, validate question
  if (!room || payload.createRoom) {
    const checkResult = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'Determine if the user\'s question is related to mental health. Respond only with "yes" or "no".',
        },
        { role: 'user', content: payload.question },
      ],
    });

    const check = checkResult.choices[0].message?.content?.trim().toLowerCase();
    if (check !== 'yes') {
      return 'I can only answer questions related to mental health.';
    }

    // Create room since it's valid
    const formattedDate = moment().format('HH:mm:ss');
    room = await Room.create({
      user: payload.user,
      roomName: payload.question + ' ' + formattedDate,
    });
  }

  // Step 3: Get previous chat messages
  const previousChats = await QuestionAndAns.find({ room: room._id })
    .sort({ createdAt: 1 })
    .select('question answer');

  // Step 4: Prepare message context
  const messages = [
    {
      role: 'system',
      content:
        "You are a compassionate AI assistant specializing in mental health support. Answer the user's mental health-related questions using the context below.",
    },
    ...previousChats.flatMap(chat => [
      { role: 'user', content: chat.question },
      { role: 'assistant', content: chat.answer },
    ]),
    { role: 'user', content: payload.question },
  ];

  // Step 5: Get GPT response
  const result = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages as any,
  });

  const answer = result.choices[0].message?.content;

  // Step 6: Save new Q&A
  const value = {
    question: payload.question,
    answer: answer,
    room: room._id,
    user: payload.user,
    createRoom: payload.createRoom,
  };

  const res = await QuestionAndAns.create(value);
  return res;
};

export const QuestionAndAnsService = {
  createChat,
};
