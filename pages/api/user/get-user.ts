import type { NextApiRequest, NextApiResponse } from 'next';
type Data = {
  res: any;
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    res.status(200).json({ res: 'Getting session', success: true });
  } catch (e: any) {
    res.status(400).json({ res: e.message, success: false });
  }
}
