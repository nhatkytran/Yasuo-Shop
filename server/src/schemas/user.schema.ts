import { TypeOf, object, string } from 'zod';

export const signupUserSchema = object({
  body: object({
    name: string(),
    email: string().email(),
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

export type SignupUserInput = Omit<
  TypeOf<typeof signupUserSchema>,
  'body.passwordConfirm'
>;
