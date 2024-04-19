import { Response } from 'express';
import { omit } from 'lodash';

type SendSuccess = (res: Response, options: { [key: string]: any }) => void;

const sendSuccess: SendSuccess = (res, { statusCode, ...others }) =>
  res.status(statusCode || 200).json({
    status: 'success',
    ...omit(others, 'statusCode'),
  });

export default sendSuccess;
