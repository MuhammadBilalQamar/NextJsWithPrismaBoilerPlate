import verifyJWT from 'libs/verifyJWT';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {

    const { accessToken, idToken, refreshToken } = req.body;

    const isTokenVerified = await verifyJWT({
      accessToken,
      idToken,
      refreshToken,
    });
    if (!isTokenVerified.success) {
      res.status(200).json({
        success: false,
        message: 'Something went wrong',
      });
    }
    else {
      res.status(200).json({
        success: true,
      });
    }
  } catch (e) {
    console.log('error====>', e);
    res.status(400).json({
      success: false,
      message: 'Something went wrong',
    });
  }
}
