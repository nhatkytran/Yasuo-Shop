import { UserDocument } from '../models/users/schemaDefs';
import AppError from '../utils/appError';
import { hashToken } from '../utils/tokenAndHash';
import { unauthenticatedError } from './session.service';

// Throw error when user have not issue token yet
export const preventNotIssuedToken = ({
  tokenField,
  codeUrl,
}: {
  tokenField?: string;
  codeUrl: string;
}): void => {
  if (!tokenField)
    throw new AppError({
      message: `Get your verification code first at ${codeUrl}`,
      statusCode: 401,
    });
};

// Throw error when token is invaid
export const preventInvalidToken = ({
  token,
  rawToken,
}: {
  token: string;
  rawToken: string;
}): void => {
  const [hash, timeout] = rawToken.split('/');

  if (hashToken(token) !== hash || Date.now() > Number(timeout))
    throw new AppError({
      message: 'Invalid token or token has expired!',
      statusCode: 401,
    });
};

// Throw error when user created by OAuth: google,...
export const preventOAuthUser = (oAuth?: any): void => {
  if (Boolean(oAuth))
    throw new AppError({
      message: 'This feature only supports accounts created manually!',
      statusCode: 403,
    });
};

// Throw error when deleted user performs action
export const preventDeletedUser = (deleteObj: UserDocument['delete']) => {
  if (!deleteObj || !deleteObj?.deleteAt) return;

  const date = deleteObj.deleteAt
    .toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    .replace(',', '');

  const message = deleteObj.byAdmin
    ? `Your account has been deleted by admin on ${date}! Please contact admin via nhockkutean2@gmail.com for more information`
    : `Your account has been deleted on ${date}! Restore your account at /api/v1/users/restore/:email'`;

  throw new AppError({ message, statusCode: 403 });
};

// Throw error when banned user performs action
export const preventBannedUser = (isBanned?: any) => {
  if (Boolean(isBanned))
    throw new AppError({
      message:
        'Your account has been banned! Please contact admin via nhockkutean2@gmail.com for more information.',
      statusCode: 403,
    });
};

// Throw error when user is already active
export const preventActiveUser = (active?: any): void => {
  if (Boolean(active))
    throw new AppError({
      message: 'User is already active!',
      statusCode: 400,
    });
};

// Throw error when inactive user
export const preventInactiveUser = (active?: any): void => {
  if (!Boolean(active))
    throw unauthenticatedError(
      'First you need to activate you account at /api/v1/users/activateCode/:email'
    );
};
