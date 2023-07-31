import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { SettingsEnums } from '../../enums/settings.enums';
import { migrations } from '../../migrations';

type Data = {
  success: boolean;
  error?: any;
};
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const setting = await prisma.settings
      .findUnique({ where: { key: SettingsEnums.Migration } })
      .catch();

    const migrationsToRun = setting
      ? migrations.slice(parseInt(setting.value as string))
      : migrations;

    for (let i = 0; i < migrationsToRun.length; i++) {
      const fn = migrationsToRun[i];
      await fn();
    }

    await prisma.settings.upsert({
      where: {
        key: SettingsEnums.Migration,
      },
      create: {
        key: SettingsEnums.Migration,
        value: migrations.length,
      },
      update: {
        value: migrations.length,
      },
    });
    res.status(200).json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.toString() });
  }
}
