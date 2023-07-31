import { PrismaClient} from '@prisma/client';
import { capitalizeFirstLetter} from 'libs/helper';

const prisma = new PrismaClient();

class UserUtils {
    static getRoleId = async (roleName: string) => {
        if (!roleName) return null;
        const role = await prisma.roles.findMany({
            where: { name: capitalizeFirstLetter(roleName) },
          })
          .catch();
        if (role && role.length > 0) {
          return role[0];
        }
        return null;
      };
    }

    export default UserUtils;