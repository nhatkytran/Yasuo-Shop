import { Express } from 'express';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import init from '../app';
import User from '../models/users/user.model';
import ProductEnUS from '../models/products/productEnUs.model';
import { createProduct } from '../services/product.service';
import { productPayload, userPayload } from './data';
import { createUser } from '../services/user.service';
import { createSession } from '../services/session.service';
import { signAccessJWT } from '../utils/jwt';

const app: Express = init();

describe('product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await ProductEnUS.deleteMany({}); // Avoid duplicate product creation
    await User.deleteMany({}); // Avoid duplicate user creation
  });

  // CRUD - READ //////////

  describe('get product route', () => {
    describe('given the product does not exist', () => {
      it('should return a 404', async () => {
        await supertest(app)
          .get(`/api/v1/products/${'a'.repeat(24)}`) // 24 is length of product's id
          .expect(404);
      });
    });

    describe('given the product does exist', () => {
      it('should return a 200 status and the product', async () => {
        const product = await createProduct({
          language: 'en-us',
          input: productPayload,
        });

        const { body, statusCode } = await supertest(app).get(
          `/api/v1/products/${product._id}`
        );

        expect(statusCode).toBe(200);
        expect(body.product._id.toString()).toBe(product._id.toString());
      });
    });
  });

  // CRUD - CREATE //////////

  const signUserJWT = async (userMetadata: any) => {
    const { user } = await createUser({
      input: { ...userPayload, ...userMetadata },
      isAdmin: true, // just a condition, check function code to understand
    });

    const session = await createSession({ userID: user._id });

    return signAccessJWT({ userID: user._id, sessionID: session._id });
  };

  describe('create product route', () => {
    describe('given the user is not logged in', () => {
      it('should return a 401', async () => {
        const { statusCode } = await supertest(app).post('/api/v1/products');

        expect(statusCode).toBe(401);
      });
    });

    describe('given the user is logged in (not admin)', () => {
      it('should return a 403', async () => {
        const jwt = await signUserJWT({ role: 'user', active: true });

        const { statusCode } = await supertest(app)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${jwt}`);

        expect(statusCode).toBe(403);
      });
    });

    describe('given the user is logged in (admin)', () => {
      it('should return a 201', async () => {
        const jwt = await signUserJWT({ role: 'admin', active: true });

        const { statusCode } = await supertest(app)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${jwt}`)
          .send(productPayload);

        expect(statusCode).toBe(201);
      });
    });
  });
});
