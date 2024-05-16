import { TypeOf, object, string } from 'zod';

import { PasswordType, Email } from './user.schema';

const OptionalUserID = { userID: string().optional() };

const paramsOptionalUserID = { params: object({ ...OptionalUserID }) };

export const signinUserSchema = object({
  body: object({ ...Email, password: PasswordType }),
});

export const signinGoogleSchema = object({
  body: object({ ...Email, googleToken: string() }),
});

export const getAllSessionsSchema = object({
  ...paramsOptionalUserID,
});

export const getSessionSchema = object({
  params: object({ sessionID: string() }),
});

export type SigninUserInput = TypeOf<typeof signinUserSchema>;
export type SigninGoogleInput = TypeOf<typeof signinGoogleSchema>;
export type GetAllSessionsInput = TypeOf<typeof getAllSessionsSchema>;
export type GetSessionInput = TypeOf<typeof getSessionSchema>;
