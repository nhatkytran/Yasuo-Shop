import type { Handler } from '@netlify/functions';

import Airtable, { Attachment, FieldSet } from 'airtable';

import catchAsync from './utils/catchAsync';
import success from './utils/sendSuccess';

import {
  createAirtable,
  selectAllRecords,
  selectRecord,
} from './utils/airtableAPIs';

const airtable = createAirtable('banners');

type Banner = { id: string; name: string; description: string; image: string };

const handler: Handler = catchAsync(async (event, context, cb) => {
  const queryString = event.queryStringParameters;

  const bannerCallback = (record: Airtable.Record<FieldSet>) => {
    return {
      id: record.id,
      name: record.fields.name as string,
      description: record.fields.description as string,
      image: (record.fields.image as Attachment[])[0].url,
    };
  };

  // Find single banner ///////

  if (queryString && queryString.id) {
    const banner = (await selectRecord(
      airtable,
      queryString.id,
      bannerCallback
    )) as Banner;

    return success({ data: { banner } });
  }

  // Find all banners ///////

  const banners = (await selectAllRecords(
    airtable,
    bannerCallback
  )) as Banner[];

  return success({ data: { banners } });
});

export { handler };
