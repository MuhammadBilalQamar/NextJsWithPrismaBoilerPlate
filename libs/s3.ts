import { GetObjectCommand, ListObjectsCommand, ListObjectsOutput, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import fs, { ReadStream } from 'fs';

const s3Configuration: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_KEY || '',
    secretAccessKey: process.env.S3_SECRET || '',
  },
  region: process.env.NEXT_PUBLIC_S3_REGION,
};

const s3client = new S3Client(s3Configuration);


export const getSignedURL = async (path: string): Promise<string> => {
  const command = new GetObjectCommand({ Bucket: process.env.NEXT_PUBLIC_S3_BUCKET, Key: path });
  return await getSignedUrl(s3client, command);
};

export const getPostSignedURL = async (key: string): Promise<PresignedPost> => {
  return createPresignedPost(s3client, {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!, Key: key,
    Fields: {
      key: key,
    },
  });
};

export const uploadFile = async  (key: string, filePath: string, fileStream?: ReadStream) => {
  if (!fileStream && filePath) {
    fileStream = fs.createReadStream(filePath);
  }
  const uploadParams = {
    ACL: 'private',
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
    Key: key,
    Body: fileStream,
  };
  return await s3client.send(new PutObjectCommand(uploadParams));
};

export const listFiles = (): Promise<ListObjectsOutput> => {
  return new Promise((resolve, reject) => {
    s3client.send(new ListObjectsCommand({ Bucket: process.env.NEXT_PUBLIC_S3_BUCKET! }), (err, data) => {
      if (err || !data) reject(err);
      if (data) resolve(data);
    });
  });
};
