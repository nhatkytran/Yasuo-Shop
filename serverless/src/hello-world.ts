import type { Handler } from '@netlify/functions';
import success from './utils/sendSuccess';

const handler: Handler = async function (event, context, cb) {
  return success({ data: { message: 'Hello World!' } });
};

export { handler };
