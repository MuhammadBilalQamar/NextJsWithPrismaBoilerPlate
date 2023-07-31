import { PrismaClient } from '@prisma/client';
import { PermissionsEnums } from '../enums/permissions.enums';

const prisma = new PrismaClient();

export default async () => {
  await prisma.permissions.create({
    data: {
      name: PermissionsEnums.Login,
      read: true,
    },
  });
};
