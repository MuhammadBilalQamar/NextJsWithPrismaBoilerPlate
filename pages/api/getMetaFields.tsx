import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  url?: string;
  error?: boolean;
  message?: string;
  data?: any;
  pathName?: string;
};

export const convertArrayToObject = (array: any) => {
  const result: any = {};

  for (let i = 0; i < array.length; i++) {
    const { key, value } = array[i];
    result[key] = value;
  }

  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const prisma = new PrismaClient();
    const { pathName } = req.body;

    if (pathName) {
      const allTags = await prisma.seos
        .findMany({
          where: {
            url: { contains: pathName.toString(), mode: 'insensitive' },
          },
        })
        .catch();

      if (allTags && allTags.length > 0) {
        const metaFields = convertArrayToObject(allTags[0].metaFields) || {};
        const other = {
          ...metaFields,
        };
        if (other) {
          res.status(200).json({
            error: false,
            pathName,
            data: {
              title: allTags[0].title || '| Fameworx |',
              other,
            },
          });
        }
      } else {
        res.status(200).json({
          error: false,
          pathName,
          data: {
            title: pathName,
          },
        });
      }
    } else {
      res.status(400).json({
        error: true,
        url: '',
        message: 'pathName must be provided',
        data: {
          title: pathName,
        },
      });
    }
  } catch (e) {
    res.status(400).json({
      error: true,
      data: {
        title: '/',
      },
    });
  }
}
