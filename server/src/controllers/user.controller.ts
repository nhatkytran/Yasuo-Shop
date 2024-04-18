import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { EmailInput, SignupUserInput } from '../schemas/user.schema';

import {
  createActionToken,
  createUser,
  findUser,
} from '../services/user.service';

export const signup = catchAsync(
  async (req: Request<{}, {}, SignupUserInput['body']>, res: Response) => {
    const user = await createUser({ input: req.body });

    res.status(200).json({ status: 'success', user });
  }
);

export const getActivateCode = catchAsync(
  async (req: Request<EmailInput['params']>, res: Response) => {
    const { email } = req.params;

    const user = await findUser({ query: { email } });

    if (!user)
      throw new AppError({
        message: `User not found with email: ${email}`,
        statusCode: 404,
      });

    if (user.googleID)
      throw new AppError({
        message:
          'Getting activate code only supports accounts created manually!',
        statusCode: 403,
      });

    if (user.active)
      throw new AppError({
        message: 'User is already active!',
        statusCode: 400,
      });

    const token = await createActionToken({ user, type: 'activate' });

    res.status(200).json({
      status: 'success',
      message: 'Token has been sent to your email. Please check.',
    });
  }
);

// export const activateUser = catchAsync(async (req: Request, res: Response) => {});
