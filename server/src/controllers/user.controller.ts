import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';

import {
  activateUser,
  createActivateToken,
  createUser,
  findUser,
  sendActivateTokenEmail,
  sendCreateUserEmail,
} from '../services/user.service';

import {
  ActivateInput,
  EmailInput,
  SignupUserInput,
} from '../schemas/user.schema';
import sendSuccess from '../utils/sendSuccess';

export const signup = catchAsync(
  async (req: Request<{}, {}, SignupUserInput['body']>, res: Response) => {
    const { user, token } = await createUser({ input: req.body });

    await sendCreateUserEmail({ user, token });

    sendSuccess(res, {
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
    const token = await createActivateToken({ user });

    await sendActivateTokenEmail({ user, token });

    sendSuccess(res, {
      message: 'Activate code has been sent to your email. Please check.',
    });
  }
);

export const activate = catchAsync(
  async (req: Request<{}, {}, ActivateInput['body']>, res: Response) => {
    const { email, code } = req.body;

    const user = await findUser({ query: { email } });

    await activateUser({ user, token: code });

    sendSuccess(res, { message: 'Activate account successfully.' });
  }
);
