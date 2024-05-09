import type { Handler } from '@netlify/functions';

import { Attachment } from 'airtable';

import catchAsync from './utils/catchAsync';
import success from './utils/sendSuccess';

import { createAirtable, selectAllRecords } from './utils/airtableAPIs';

const airtable = createAirtable('slides');

type Slide = { id: string; name: string; image: string };

const handler: Handler = catchAsync(async (event, context, cb) => {
  const slides: Slide[] = (await selectAllRecords(airtable, record => {
    return {
      id: record.id,
      name: record.fields.name as string,
      image: (record.fields.image as Attachment[])[0].url,
    };
  })) as Slide[];

  return success({ data: { slides } });
});

export { handler };
