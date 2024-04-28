import AWS from 'aws-sdk';

import config from 'config';
import AppError from '../utils/appError';

const region = config.get<string>('awsRegion');
const bucketName = config.get<string>('awsBucketName');
const accessKeyId = config.get<string>('awsAccessKey');
const secretAccessKey = config.get<string>('awsPrivateKey');

const s3 = new AWS.S3({ region, accessKeyId, secretAccessKey });

const getSignedUrlPromisified = (params: any): Promise<string | void> =>
  new Promise((resolve, reject) =>
    s3.getSignedUrl('putObject', params, (error: any, url: string) =>
      error ? reject(error) : resolve(url)
    )
  );

const s3getSingedUrl = async (userID: string): Promise<string | void> => {
  try {
    const filename = `${userID}/${Date.now()}.jpeg`;

    const params = {
      Bucket: bucketName,
      Key: filename,
      ContentType: 'image/jpeg',
      Expires: 60,
    };

    return await getSignedUrlPromisified(params);
  } catch (error: any) {
    throw new AppError({
      message: 'Failed to generate pre-signed URL!',
      statusCode: 500,
    });
  }
};

export default s3getSingedUrl;
