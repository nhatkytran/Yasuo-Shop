import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import sendSuccess from '../utils/sendSuccess';
import env from '../utils/env';

import {
  activateUser,
  changePassword,
  createActivateToken,
  createForgotPasswordToken,
  createUser,
  findAllUsers,
  findUser,
  identifyWhoDeleteUser,
  resetUserPassword,
  sendActivateTokenEmail,
  sendCreateUserEmail,
  sendForgotPasswordTokenEmail,
  updateUser,
} from '../services/user.service';

import {
  ActivateInput,
  CreateNewUserInput,
  EmailInput,
  GetUserByEmailInput,
  ResetPasswordInput,
  SignupUserInput,
  UpdatePasswordInput,
} from '../schemas/user.schema';

// Sign up //////////

export const signup = catchAsync(
  async (req: Request<{}, {}, SignupUserInput['body']>, res: Response) => {
    const { user, token } = await createUser({ input: req.body });

    if (env.prod) await sendCreateUserEmail({ user, token });

    sendSuccess(res, {
      statusCode: 201,
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
  async (req: Request<{}, {}, UpdatePasswordInput['body']>, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await findUser({
      query: { _id: res.locals.user._id },
      selectFields: ['password'],
    });

    await changePassword({ user, currentPassword, newPassword });

    sendSuccess(res, { message: 'Update password successfully!' });
  }
);

// Ban user -> ?userID=<id> || ?email=<email> //////////

export const banAccount = catchAsync(async (req: Request, res: Response) => {
  const { userID, email } = req.query;
});

// CRUD //////////

export const getMe = catchAsync(async (req: Request, res: Response) =>
  sendSuccess(res, { user: res.locals.user })
);

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await findAllUsers({ reqQuery: req.query });

  sendSuccess(res, { numResults: users.length, users });
});

export const getUser = catchAsync(
  async (req: Request<GetUserByEmailInput['params']>, res: Response) => {
    const user = await findUser({
      query: { email: req.params.email },
      selectFields: [
        'password',
        'googleID',
        'activateToken',
        'forgotPasswordToken',
        'passwordChangedAt',
        'restoreToken',
      ],
    });

    sendSuccess(res, { numResults: 1, user });
  }
);

export const createNewUser = catchAsync(
  async (req: Request<{}, {}, CreateNewUserInput['body']>, res: Response) => {
    const { user } = await createUser({ input: req.body, isAdmin: true });

    sendSuccess(res, {
      statusCode: 201,
      message: 'Create user successfully.',
      user,
    });
  }
);

export const checkWhoDeleteUser = catchAsync(
  async (
    req: Request<GetUserByEmailInput['params']>,
    res: Response,
    next: NextFunction
  ) => {
    const { user } = res.locals;
    const { email } = req.params;

    identifyWhoDeleteUser({ whoUser: user, deletedUserEmail: email });

    next();
  }
);

export const deleteUser = catchAsync(
  async (req: Request<GetUserByEmailInput['params']>, res: Response) => {
    const { user } = res.locals;
    const { email } = req.params;

    await updateUser({
      filter: { email },
      update: {
        delete: { byAdmin: user.role === 'admin', deleteAt: new Date() },
      },
    });

    sendSuccess(res, { statusCode: 204 });
  }
);

export const restoreUser = catchAsync(
  async (req: Request, res: Response) => {}
);
