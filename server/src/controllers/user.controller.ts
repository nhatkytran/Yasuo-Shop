import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import { createUser } from '../services/user.service';
import { SignupUserInput } from '../schemas/user.schema';

export const signup = catchAsync(
  async (req: Request<{}, {}, SignupUserInput['body']>, res: Response) => {
    const user = await createUser({ input: req.body });

    res.status(200).json({ status: 'success', user });
  }
);
