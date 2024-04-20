import { TypeOf, object } from 'zod';

import { PasswordType, Email } from './user.schema';

export const signinUserSchema = object({
  body: object({ ...Email, password: PasswordType }),
});

export type SigninUserInput = TypeOf<typeof signinUserSchema>;
