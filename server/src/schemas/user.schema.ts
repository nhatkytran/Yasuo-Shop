import { TypeOf, object, string } from 'zod';

export const PasswordType = string()
  .min(8)
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/,
    'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character!'
  );

export const Email = { email: string().email() };
const Code = { code: string() };

export const signupUserSchema = object({
  body: object({
    ...Email,
    name: string(),
    password: PasswordType,
    passwordConfirm: string(),
  }).refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords do not match!',
    path: ['passwordConfirm'],
  }),
});

export const emailSchema = object({ params: object({ ...Email }) });
export const activateSchema = object({ body: object({ ...Email, ...Code }) });
export const resetPasswordSchema = object({
  body: object({
    ...Email,
    ...Code,
    newPassword: PasswordType,
  }),
});

export type SignupUserInput = Omit<
  TypeOf<typeof signupUserSchema>,
  'body.passwordConfirm'
>;
export type EmailInput = TypeOf<typeof emailSchema>;
export type ActivateInput = TypeOf<typeof activateSchema>;
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
