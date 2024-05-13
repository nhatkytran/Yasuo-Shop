import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import config from 'config';
import AppError from '../utils/appError';

const region = config.get<string>('awsRegion');
const bucketName = config.get<string>('awsBucketName');
const accessKeyId = config.get<string>('awsAccessKey');
const secretAccessKey = config.get<string>('awsPrivateKey');

const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

const s3GetSignedUrl = async (userID: string): Promise<string | void> => {
  throw new AppError({
    message: "Sorry, we don't support this action now",
    statusCode: 500,
  });

  try {
    const filename = `${userID}/${Date.now()}.jpeg`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      ContentType: 'image/jpeg',
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 60 });
  } catch (error: any) {
    throw new AppError({
      message: 'Failed to generate pre-signed URL!',
      statusCode: 500,
    });
  }
};

export default s3GetSignedUrl;
