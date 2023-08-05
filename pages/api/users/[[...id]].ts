import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import restHandlers from '../../../libs/rest-handlers';
import UserUtils from './UserUtils';

const prisma = new PrismaClient();

class usersAPI extends restHandlers {
  model = prisma.users;

  beforeGet = async (req: NextApiRequest, where: any, include: any) => {
    const search: any = req.query.search;
    include['role'] = true;
    include['profiles'] = {
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        userCategory: true,
        bookings: true,
        status: true,
        portfolio: true,
        polaroids: true,
        videos: true,
        resume: true,
        profileType: true,
        profileTypeId: true,
      },
    };
    if (search && typeof search === 'string') {
      where.OR = [];
      const searchValues = search.split(',');
      searchValues.forEach((value: any) => {
        where.OR.push({
          email: { contains: value, mode: 'insensitive' },
        });
        where.OR.push({
          name: { contains: value, mode: 'insensitive' },
        });
      });
    }
    const email = req.query.email;
    if (email) {
      where.email = email;
    }
  };

  beforeInsert = async (req: NextApiRequest, body: any) => {
    const reqBody = req.body;
    if (reqBody.username) body.username = reqBody.username;
    if (reqBody.role) body.role = { connect: { id: reqBody.role } } || null;
    if (reqBody.name) body.name = reqBody.name;
    if (reqBody.email) body.email = reqBody.email;
    if (reqBody.phoneNumber) body.phoneNumber = reqBody.phoneNumber;
    if (reqBody.address) body.address = reqBody.address;
    if (reqBody.avatar) body.avatar = reqBody.avatar;
  };

  // afterInsert = async (_req: NextApiRequest, _data: Users) => {
  // await prisma.profiles.create({
  //   data: {
  //     name: data.name,
  //     user: { connect: { id: data?.id } },
  //     role: { connect: { name: RolesEnums.User } },
  //   },
  // });
  // };

  beforeUpdate = async (req: NextApiRequest, body: any) => {
    const reqBody = req.body;
    if (reqBody.username) body.username = reqBody.username;
    if (reqBody.roleId) body.roleId = reqBody.roleId || null;
    if (reqBody.name) body.name = reqBody.name;
    if (reqBody.email) body.email = reqBody.email;
    if (reqBody.phone) body.phone = reqBody.phone;
    if (reqBody.address) body.address = reqBody.address;
    if (reqBody.avatar) body.avatar = reqBody.avatar;
    if (reqBody.role) {
      const role = await UserUtils.getRoleId(reqBody.role);
      body.roleId = role?.id;
    }

    if (reqBody.notifications)
      body.notifications = { connect: { id: reqBody.notifications } } || [];
    if (reqBody.messages)
      body.messages = { connect: { id: reqBody.messages } } || [];
    if (reqBody.messagesSeen)
      body.messagesSeen = { connect: { id: reqBody.messagesSeen } } || [];
    if (reqBody.chatRooms)
      body.chatRooms = { connect: { id: reqBody.chatRooms } } || [];
    if (reqBody.lastMessageChatrooms)
      body.lastMessageChatrooms =
        { connect: { id: reqBody.lastMessageChatrooms } } || [];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  new usersAPI(req, res);
}

export const config = {
  api: {
    bodyParser: true,
  },
};
