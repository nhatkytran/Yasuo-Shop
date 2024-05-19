import { Express } from 'express';
import supertest from 'supertest';

import init from '../app';
import * as UserService from '../services/user.service';
import * as SessionService from '../services/session.service';
import { signin } from '../controllers/session.controller';
import { userPayload } from './data';

const app: Express = init();

describe('user', () => {
  describe('user registration', () => {
    describe('given the username and password are valid', () => {
      it('should return a 200', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          .mockReturnValueOnce({ user: {}, token: '' } as any);

        const userInput = {
          ...userPayload,
          passwordConfirm: userPayload.password,
        };

        const { body, statusCode } = await supertest(app)
          .post('/api/v1/users/signup')
          .send(userInput);

        console.log(body);
        console.log(statusCode);

        expect(statusCode).toBe(201);

        expect(body).toEqual({
          status: 'success',
          message:
            'Sign up successfully. Your activate code is sent to your email! Please check.',
          user: {},
        });

        expect(createUserServiceMock).toHaveBeenCalledWith({
          input: userInput,
        });
      });
    });

    describe('given the passwords do not match', () => {
      it('should return a 400', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          .mockReturnValueOnce(null as any);

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/signup')
          .send({ ...userPayload, passwordConfirm: 'doesnotmatch' });

        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe('given the user service throws', () => {
      it('should return a 500', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'createUser')
          .mockRejectedValueOnce('Something went wrong!');

        const { statusCode } = await supertest(app)
          .post('/api/v1/users/signup')
          .send({ ...userPayload, passwordConfirm: userPayload.password });

        expect(statusCode).toBe(500);
        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  describe('create user session', () => {
    describe('given the username and password are valid', () => {
      it('should return a signed accessToken & refresh token', async () => {
        jest
          .spyOn(UserService, 'findUser')
          .mockReturnValue({ _id: 'UserID' } as any);

        jest
          .spyOn(SessionService, 'validatePassword')
          .mockReturnValue(null as any);

        jest
          .spyOn(SessionService, 'createSession')
          .mockReturnValue({ _id: 'SessionID' } as any);

        const req = {
          get: (key: any) => 'a user agent',
          body: { email: 'test@example.com', password: 'Password123' },
        };

        const json = jest.fn();
        const res = { status: (_: number) => res, json };

        // @ts-ignore
        await signin(req, res);

        expect(json).toHaveBeenCalledWith({
          status: 'success',
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
