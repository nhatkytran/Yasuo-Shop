import createDB from '../src/utils/createDB';

const {
  DATABASE,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_COLLECTION_NAME,
  EMAIL_AUTHOR,
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD,
  BREVO_HOST,
  BREVO_PORT,
  BREVO_KEY_NAME,
  BREVO_KEY_VALUE,
  AWS_REGION,
  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY,
  AWS_PRIVATE_KEY,
  PUBLIC_KEY,
  PRIVATE_KEY,
} = process.env;

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
  bcryptSaltFactor: 12,
  databaseURL,
  defaultLanguage: 'en-us',
  languageSupport: ['en-us', 'fr'],
  parameterWhiteList,
  emailAuthor: EMAIL_AUTHOR,
  mailtrapHost: MAILTRAP_HOST,
  mailtrapPort: Number(MAILTRAP_PORT),
  mailtrapUsername: MAILTRAP_USERNAME,
  mailtrapPassword: MAILTRAP_PASSWORD,
  brevoHost: BREVO_HOST,
  brevoPort: Number(BREVO_PORT),
  brevoKeyName: BREVO_KEY_NAME,
  brevoKeyValue: BREVO_KEY_VALUE,
  awsRegion: AWS_REGION,
  awsBucketName: AWS_BUCKET_NAME,
  awsAccessKey: AWS_ACCESS_KEY,
  awsPrivateKey: AWS_PRIVATE_KEY,
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
  accessTokenTtl: '30m',
  refreshTokenTtl: '30d',
  accessTokenCookieTtl: 30 * 60 * 1000,
  refreshTokenCookieTtl: 30 * 24 * 60 * 60 * 1000,
};
