import { Express } from 'express';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import init from '../app';

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

  describe('get product route', () => {
    describe('given the product does not exist', () => {
      it('should return a 404', async () => {
        const productID = 'a'.repeat(24); // 24 is length of product's id

        await supertest(app)
          .get(`/api/v1/products/663e30b7947d905b5b60311b`)
          .expect(404);
      });
    });
  });
});
