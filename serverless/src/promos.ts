import type { Handler } from '@netlify/functions';
import Airtable, { Attachment, FieldSet } from 'airtable';

import catchAsync from './utils/catchAsync';
import success from './utils/sendSuccess';

import {
  createAirtable,
  selectAllRecords,
  selectRecord,
} from './utils/airtableAPIs';

const airtable = createAirtable('promos');

type Promo = {
  id: string;
  category: string;
  collection: string;
  image: string;
};

const handler: Handler = catchAsync(async (event, context, cb) => {
  const queryString = event.queryStringParameters;

  const promoCallback = (record: Airtable.Record<FieldSet>) => {
    return {
      id: record.id,
      category: record.fields.category as string,
      collection: record.fields.collection as string,
      image: (record.fields.image as Attachment[])[0].url,
    };
  };

  // Find single promo ///////

  if (queryString && queryString.id) {
    const promo = (await selectRecord(
      airtable,
      queryString.id,
      promoCallback
    )) as Promo;

    return success({ data: { promo } });
  }

  // Find all promos ///////

  const promos = (await selectAllRecords(airtable, promoCallback)) as Promo[];

  return success({ data: { promos } });
});

export { handler };
