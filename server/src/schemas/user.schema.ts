import { TypeOf, object, string } from 'zod';

const Email = { email: string().email() };

export const signupUserSchema = object({
  body: object({
    ...Email,
    name: string(),
    password: string()
      .min(8)
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character!'
      ),
    passwordConfirm: string(),
  }).refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords do not match!',
    path: ['passwordConfirm'],
  }),
});

export const emailSchema = object({ params: object({ ...Email }) });

export type SignupUserInput = Omit<
  TypeOf<typeof signupUserSchema>,
  'body.passwordConfirm'
>;

export type EmailInput = TypeOf<typeof emailSchema>;
