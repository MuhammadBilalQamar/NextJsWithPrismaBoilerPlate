import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { File } from '@prisma/client';
import { uploadFile } from '../../libs/s3';

const post = async (
  req: NextApiRequest,
  res: NextApiResponse<File | String>,
) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async function(err, fields, files: any) {
    const file = files.file;
    const key = `${new Date().getTime()}_${file.originalFilename}`;
    await uploadFile(
      key,
      file.filepath,
    );

    return res.status(201).send({
      path: key,
      name: file.originalFilename,
      size: file.size,
      type: file.mimetype,
    });
  });
};

export default (req: NextApiRequest, res: NextApiResponse<File | String>) => {
  if (req.method === 'POST') {
    post(req, res);
    return;
  }

  console.log(req.method);
  return res.status(201).send('');
};

export const config = {
  api: {
    bodyParser: false,
  },
};
