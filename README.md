## Yasuo API - Yasuo Shop

This API provides programmatic access to a vast collection of merchandise related to the popular game League of Legends. Integrate this API into your application to offer users a convenient way to browse, search, and potentially purchase officially licensed League of Legends merchandise.

**Back-end**: TypeScript, NodeJS (ExpressJS), MongoDB (Mongoose), Zod, AWS S3, Stripe Payment, EJS, Acess Token and Refresh Token (Public Key and Private Key), Google OAuth 2.0,...

**Testing and Performance**: Jest, Supertest, Premetheus

**Serverless**: Netlify Functions, Airtable, TypeScript

## Back-end

Install all the packages: yarn install

Run this app NODE_ENV=development: yarn dev

- http://127.0.0.1:1337

Run this app NODE_ENV=production: yarn prod

Build: yarn build

Import and delete dev data:
yarn dev-data (--import | --delete)

## Testing and Performance

Run this app NODE_ENV=test: yarn test

Performance:

- yarn dev
- http://127.0.0.1:9100/metrics

## Serverless

- https://yasuo-api-serverless.netlify.app/
