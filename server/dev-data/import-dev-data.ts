import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: path.join(__dirname, '../.env') });

import config from 'config';
import Product from '../src/models/product.model';

const getData = (fileName: string) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, fileName), 'utf-8'));

const productsData = getData('products.json');

// yarn dev-data --import
const importData = async () => {
  try {
    await Promise.all([Product.create(productsData)]);

    console.log('Data import - Successful!');
  } catch (error) {
    console.error('Data import - Failed!');
    console.error(error);
  } finally {
    process.exit();
  }
};

// yarn dev-data --delete
const deleteData = async () => {
  try {
    await Promise.all([Product.deleteMany()]);

    console.log('Data delete - Successful!');
  } catch (error) {
    console.error('Data delete - Failed!');
    console.error(error);
  } finally {
    process.exit();
  }
};

(async () => {
  try {
    await mongoose
      .set('strictQuery', true)
      .connect(config.get<string>('databaseURL'));

    console.log('Database connection - Successful!');

    switch (process.argv.at(-1)) {
      case '--import':
        importData();
        break;
      case '--delete':
        deleteData();
        break;
      default:
        console.error('Action (--import | --delete) missing!');
        process.exit();
    }
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);
  }
})();
