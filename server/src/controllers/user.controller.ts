import { Request, Response } from 'express';
import { omit } from 'lodash';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { EmailInput, SignupUserInput } from '../schemas/user.schema';

import {
  createActionToken,
  createUser,
  findUser,
} from '../services/user.service';
import Email from '../utils/sendEmail';

export const signup = catchAsync(
  async (req: Request<{}, {}, SignupUserInput['body']>, res: Response) => {
    const user = await createUser({ input: req.body });

    const token = await createActionToken({ user, type: 'activate' });

    try {
      await new Email(user).sendWelcome({ oAuth: false, code: token });
    } catch (error: any) {
      user.activateToken = undefined;
      await user.save({ validateModifiedOnly: true });

      throw new AppError({
        message:
          'Something went wrong sending email! Please activate account manually.',
        statusCode: 500,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Your activate code is sent to your email! Please check.',
      user: omit(user.toJSON(), 'password', 'ban'),
    });
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

    try {
      await new Email(user).sendWelcome({ oAuth: false, code: token });
    } catch (error: any) {
      user.activateToken = undefined;
      await user.save({ validateModifiedOnly: true });

      throw new AppError({
        message:
          'Something went wrong sending email! Please activate account manually.',
        statusCode: 500,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Token has been sent to your email. Please check.',
    });
  }
);

// export const activateUser = catchAsync(async (req: Request, res: Response) => {});
