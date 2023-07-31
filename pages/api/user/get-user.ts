import type { NextApiRequest, NextApiResponse } from 'next';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
type Data = {
  res: CognitoAccessTokenPayload | string;
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
