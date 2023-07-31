import { PrismaClient } from '@prisma/client';
import { RolesEnums } from '../enums/roles.enums';

const prisma = new PrismaClient();

export default async () => {
  await prisma.roles.create({
    data: { name: RolesEnums.Admin, permissions: [] },
  });
  await prisma.roles.create({
    data: { name: RolesEnums.Staff, permissions: [] },
  });
  await prisma.roles.create({
    data: { name: RolesEnums.User, permissions: [] },
  });
};
