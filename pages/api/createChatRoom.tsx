import prismadb from 'configs/primsadb';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  url?: string;
  error?: boolean;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const reqBody = req.body;
    const body: any = {};
    const receiverId = reqBody.receiverId;
    const receiver = reqBody.receiver;
    const senderId = reqBody.senderId;
    const profile = reqBody.profile;

    if (receiverId && senderId && receiver) {
      const chatRoom = await prismadb.chatRooms.findFirst({
        where: {
          AND: [
            {
              members: {
                some: {
                  id: receiverId,
                },
              },
            },
            {
              members: {
                some: {
                  id: senderId,
                },
              },
            },
          ],
        },
      });
      if (chatRoom) {
        res.status(200).json({
          error: true,
          data: chatRoom,
          message: 'Chatroom already exist',
        });
      } else {
        body.members = {
          connect: [{ id: receiverId }, { id: senderId }],
        };
        body.lastMessageSender = { connect: { id: senderId } };
       if(profile) body.profile = { connect: { id: profile.id } };
        body.disabled = reqBody.disabled || false;
        body.isTyping = reqBody.isTyping || false;
        body.messagesCount = reqBody.messagesCount || 0;

        const newChatRoom = await prismadb.chatRooms.create({
          data: body,
        });

        // TODO: UNCOMMENT WHEN SEND GRID IS READY

        // SEND EMAIL TO RECEIVER START
        // const chatRoomId = newChatRoom?.id;
        // const isBookingRequest = reqBody.isBookingRequest || false;
        // const receiverName = (receiver?.firstName + ' ' + receiver?.lastName) || 'User';
        // const receiverEmail = receiver?.email || '';
        // const subject = reqBody.subject || 'Admin has send a message to you';
        // const emailContent = reqBody.message || `Fameworx admin has started a conversation with you on fameworx`
        // const emailTemplate = SendGridEmailHelper.generateEmailTemplate(receiverName, emailContent, chatRoomId, isBookingRequest);

        // await SendGridEmailHelper.sendEmail(receiverEmail, subject, emailTemplate);
        // SEND EMAIL TO RECEIVER END

        res.status(200).json({
          error: false,
          message: 'Chatroom created successfully',
          data: newChatRoom,
        });
      }
    } else {
      res.status(500).json({
        error: true,
        data: null,
        message: 'Receiver id or sender id is missing',
      });
    }
  } catch (e) {
    res.status(400).json({
      error: true,
      data: null,
      message: 'Something went wrong' + JSON.stringify(e),
    });
  }
}
