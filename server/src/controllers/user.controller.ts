import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import sendSuccess from '../utils/sendSuccess';

import {
  activateUser,
  createActivateToken,
  createForgotPasswordToken,
  createUser,
  findUser,
  resetUserPassword,
  sendActivateTokenEmail,
  sendCreateUserEmail,
  sendForgotPasswordTokenEmail,
} from '../services/user.service';

import {
  ActivateInput,
  EmailInput,
  ResetPasswordInput,
  SignupUserInput,
} from '../schemas/user.schema';

// Sign up //////////

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

// Activate user -> active: true //////////

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

    const user = await findUser({
      query: { email },
      selectFields: ['activateToken'],
    });

    await activateUser({ user, token: code });

    sendSuccess(res, { message: 'Activate account successfully.' });
  }
);

// Passwords //////////

export const forgotPassword = catchAsync(
  async (req: Request<EmailInput['params']>, res: Response) => {
    const user = await findUser({ query: { email: req.params.email } });
    const token = await createForgotPasswordToken({ user });

    await sendForgotPasswordTokenEmail({ user, token });

    sendSuccess(res, {
      message:
        'Forgot password code has been sent to your email. Please check.',
    });
  }
);

export const resetPassword = catchAsync(
  async (req: Request<{}, {}, ResetPasswordInput['body']>, res: Response) => {
    const { email, code, newPassword } = req.body;

    const user = await findUser({
      query: { email },
      selectFields: ['forgotPasswordToken'],
    });

    await resetUserPassword({ user, token: code, newPassword });

    sendSuccess(res, { message: 'Reset password successfully.' });
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response) => {}
);
