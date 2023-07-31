import type { NextApiRequest, NextApiResponse } from 'next';
import { getPostSignedURL } from '../../libs/s3';

type Data = {
  url?: string;
  error?: boolean;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const { key } = req.body;

    if (key) {
      const data = await getPostSignedURL(key);

      // return reponse with headers
      res.status(200).json({ error: false, data: data.fields, url: data.url });
    } else {
      res
        .status(400)
        .json({ error: true, url: '', message: 'key must be provided' });
    }
  } catch (e) {
    res.status(400).json({ error: true });
  }
}
