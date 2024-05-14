import type { Handler } from '@netlify/functions';
import { Attachment } from 'airtable';

import catchAsync from './utils/catchAsync';
import success from './utils/sendSuccess';
import AppError from './utils/appError';
import { createAirtable, selectAllRecords } from './utils/airtableAPIs';

const airtable = createAirtable('slides');

type Slide = { id: string; name: string; image: string };

const handler: Handler = catchAsync(async (event, context, cb) => {
  const queryString = event.queryStringParameters;
  let language: string = 'en-us';

  if (queryString && queryString.language) {
    if (!['en-us', 'fr'].includes(queryString.language))
      throw new AppError({
        message: `Language '${queryString.language}' is not supported!`,
        statusCode: 400,
      });

    if (queryString.language === 'fr') language = 'fr';
  }

  const slides: Slide[] = (await selectAllRecords(airtable, record => {
    return {
      id: record.id,
      name: record.fields[language === 'en-us' ? 'name' : 'nameFR'] as string,
      image: (record.fields.image as Attachment[])[0].url,
    };
  })) as Slide[];

  return success({ data: { slides } });
});

export { handler };
