import { TypeOf, object, string } from 'zod';

import { PasswordType, Email } from './user.schema';

const params = {
  params: object({
    sessionID: string({ required_error: `Session's ID is required!` }),
  }),
};

export const getAllSessionsSchema = object({
  params: object({ userID: string().optional() }),
});

export const signinUserSchema = object({
  body: object({ ...Email, password: PasswordType }),
});

export const getSessionSchema = object({ ...params });

export type SigninUserInput = TypeOf<typeof signinUserSchema>;
export type GetAllSessionsInput = TypeOf<typeof getAllSessionsSchema>;
export type GetSessionInput = TypeOf<typeof getSessionSchema>;
