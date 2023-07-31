import { PrismaClient } from '@prisma/client';
import { RolesEnums } from '../enums/roles.enums';
import { PermissionsEnums } from '../enums/permissions.enums';

const prisma = new PrismaClient();

export default async () => {
  await prisma.roles.create({
    data: {
      name: RolesEnums.Blocked,
      permissions: [
        {
          name: PermissionsEnums.Login,
          read: false,
          write: false,
          delete: false,
          update: false,
        },
      ],
    },
  });
};
