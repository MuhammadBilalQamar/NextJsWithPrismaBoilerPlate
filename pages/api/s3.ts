// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSignedURL } from '../../libs/s3';

type Data = {
  url?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.body.path) {
    try {
      res.status(200).json({ url: await getSignedURL(req.body.path) });
    } catch (e) {
      res.status(400).json({});
    }
  } else {
    res.status(400).json({});
  }
}