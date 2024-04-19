import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { EmailInput, SignupUserInput } from '../schemas/user.schema';

import {
  createActionToken,
  createUser,
  findUser,
  handleSendEmails,
} from '../services/user.service';

export const signup = catchAsync(
  async (req: Request<{}, {}, SignupUserInput['body']>, res: Response) => {
    const { user, token } = await createUser({ input: req.body });

    await handleSendEmails({
      user,
      token,
      sendMethod: 'sendWelcome',
      field: 'activateToken',
      errorMessage: 'Please activate account manually.',
    });

    res.status(200).json({
      status: 'success',
      message:
        'Sign up successfully. Your activate code is sent to your email! Please check.',
      user,
    });
  }
);

export const getActivateCode = catchAsync(
  async (req: Request<EmailInput['params']>, res: Response) => {
    const { email } = req.params;

    const user = await findUser({ query: { email } });

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

    await handleSendEmails({
      user,
      token,
      sendMethod: 'sendActivate',
      field: 'activateToken',
      errorMessage: 'Please activate account manually.',
    });

    res.status(200).json({
      status: 'success',
      message: 'Activate code has been sent to your email. Please check.',
    });
  }
);

// export const activateUser = catchAsync(async (req: Request, res: Response) => {});
