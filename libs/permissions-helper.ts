import { PrismaClient, Permission, Permissions } from '@prisma/client';
import { PermissionsEnums } from '../enums/permissions.enums';

const prisma = new PrismaClient();

export const hasPermission = async (
  permission: PermissionsEnums,
  session: any
): Promise<Permissions> => {
  const role = await prisma.roles.findUnique({
    where: {
      // @ts-ignore
      id: session?.user?.roleId,
    },
  });

  const rolePermissions = role
    ? role.permissions.find((p: Permission) => p.name === permission)
    : null;

  if (rolePermissions) {
    return {
      ...rolePermissions,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '',
      deleted: false,
    };
  } else {
    const permissionObj = await prisma.permissions.findUnique({
      where: { name: permission },
    });

    return permissionObj
      ? permissionObj
      : {
          id: '',
          name: permission,
          read: false,
          write: false,
          update: false,
          delete: false,
          updatedAt: new Date(),
          createdAt: new Date(),
          deleted: false,
        };
  }
};
