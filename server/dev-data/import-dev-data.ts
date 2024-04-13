import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: path.join(__dirname, '../.env') });

import config from 'config';

import ProductEnUS from '../src/models/products/productEnUs.model';
import ProductFR from '../src/models/products/productFr.model';

const getData = (fileName: string) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, fileName), 'utf-8'));

const getDataOther = (filename: string, originData: any) => {
  const dataOther = getData(filename);

  return originData.map((data: any, index: number) => {
    let optional;
    if (data.information?.optional) {
      optional = {
        optional: {
          ...data.information.optional,
          ...dataOther.information?.optional,
        },
      };
    }

    return {
      ...data,
      ...dataOther[index],
      information: {
        ...data.information,
        ...dataOther[index].information,
        ...(optional && optional),
      },
    };
  });
};

const productsDataEnUS = getData('./products/en-us.json');
const productDataFR = getDataOther('./products/fr.json', productsDataEnUS);

// yarn dev-data --import
const importData = async () => {
  try {
    // products
    await Promise.all([
      ProductEnUS.insertMany(productsDataEnUS),
      ProductFR.insertMany(productDataFR),
    ]);

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
    // products
    await Promise.all([ProductEnUS.deleteMany(), ProductFR.deleteMany()]);

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
