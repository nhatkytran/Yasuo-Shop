import { TypeOf, object, string } from 'zod';

import { PasswordType, Email } from './user.schema';

const SessionID = {
  sessionID: string({ required_error: `Session's ID is required!` }),
};
const OptionalUserID = { userID: string().optional() };

const paramsOptionalUserID = { params: object({ ...OptionalUserID }) };

export const signinUserSchema = object({
  body: object({ ...Email, password: PasswordType }),
});

export const getAllSessionsSchema = object({
  ...paramsOptionalUserID,
});

export const getSessionSchema = object({
  params: object({ ...SessionID, ...OptionalUserID }),
});

export type SigninUserInput = TypeOf<typeof signinUserSchema>;
export type GetAllSessionsInput = TypeOf<typeof getAllSessionsSchema>;
export type GetSessionInput = TypeOf<typeof getSessionSchema>;
