import dotenv from 'dotenv';
import Airtable, { FieldSet, Record, Table } from 'airtable';

import AppError from './appError';

// ENV //////////

dotenv.config();

const { AIRTABLE_API_KEY, AIRTABLE_BASE } = process.env;

// Create Airtable //////////

export const createAirtable = (tableName: string) =>
  new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE!)(tableName);

// CRUD //////////

export const selectAllRecords = (
  airtable: Table<FieldSet>,
  callback: (record: Record<FieldSet>) => void
) =>
  new Promise((resolve, reject) => {
    airtable.select({ view: 'Grid view' }).eachPage(
      records => resolve(records.map(callback)),
      (error: any) => error && reject(error)
    );
  });

export const selectRecord = (
  airtable: Table<FieldSet>,
  recordID: string,
  callback: (record: Record<FieldSet>) => any
) =>
  new Promise((resolve, reject) => {
    airtable.find(recordID, function (error: any, record) {
      if (error) {
        const { message, statusCode } = error;
        return reject(new AppError({ message, statusCode }));
      }

      if (!record)
        return reject(new AppError({ message: 'Not found!', statusCode: 404 }));

      resolve(callback(record!));
    });
  });
