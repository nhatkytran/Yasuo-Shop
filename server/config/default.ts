import createDB from '../src/utils/createDB';

const { DATABASE, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_COLLECTION_NAME } =
  process.env;

// Database
const databaseURL = createDB(DATABASE as string, {
  '<DATABASE_NAME>': DATABASE_NAME,
  '<DATABASE_PASSWORD>': DATABASE_PASSWORD,
  '<DATABASE_COLLECTION_NAME>': DATABASE_COLLECTION_NAME,
});

// Parameter
const parameterWhiteList = [
  'name',
  'price.default',
  'price.saleAmount',
  'price.currency',
  'type',
  'category',
  'shippingDays',
  'sort', // Advanced API
  'fields', // Advanced API
];

export default {
  port: 1337,
  databaseURL,
  defaultLanguage: 'en-us',
  languageSupport: ['en-us', 'fr'],
  parameterWhiteList,
};
