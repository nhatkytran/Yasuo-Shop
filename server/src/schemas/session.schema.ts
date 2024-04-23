import { TypeOf, object, string } from 'zod';

import { PasswordType, Email } from './user.schema';

const paramsSessionID = {
  params: object({
    sessionID: string({ required_error: `Session's ID is required!` }),
  }),
};

const paramsOptionalUserID = {
  params: object({ userID: string().optional() }),
};

export const signinUserSchema = object({
  body: object({ ...Email, password: PasswordType }),
});

export const getAllSessionsSchema = object({
  ...paramsOptionalUserID,
});

export const getSessionSchema = object({ ...paramsSessionID });

export type SigninUserInput = TypeOf<typeof signinUserSchema>;
export type GetAllSessionsInput = TypeOf<typeof getAllSessionsSchema>;
export type GetSessionInput = TypeOf<typeof getSessionSchema>;
