import env from '../src/utils/env';
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
  GOOGLE_ID,
  GOOGLE_SECRET,
  STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY,
  PUBLIC_KEY,
  PRIVATE_KEY,
} = process.env;

// Database
const databaseURL = createDB(DATABASE as string, {
  '<DATABASE_NAME>': DATABASE_NAME,
  '<DATABASE_PASSWORD>': DATABASE_PASSWORD,
  '<DATABASE_COLLECTION_NAME>': DATABASE_COLLECTION_NAME,
});

// Parameters
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

// Google Authentication
const GOOGLE_ROOT_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

const GOOGLE_REDIRECT =
  env.dev || env.test
    ? 'http://127.0.0.1:1337/api/v1/sessions/oauth/google/callback'
    : 'https://yasuo-api.onrender.com/api/v1/sessions/oauth/google/callback';

// Client URLsc
const clientOriginUrl =
  env.dev || env.test
    ? 'http://127.0.0.1:3000/'
    : 'https://yasuo-shop.netlify.app/';

// Config
export default {
  clientOriginUrl,
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
  googleID: GOOGLE_ID,
  googleSecret: GOOGLE_SECRET,
  googleRootUrl: GOOGLE_ROOT_URL,
  googleRedirect: GOOGLE_REDIRECT,
  stripePublickKey: STRIPE_PUBLIC_KEY,
  stripeSecretKey: STRIPE_SECRET_KEY,
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
  accessTokenTtl: '30m',
  refreshTokenTtl: '30d',
  accessTokenCookieTtl: 30 * 60 * 1000,
  refreshTokenCookieTtl: 30 * 24 * 60 * 60 * 1000,
};
