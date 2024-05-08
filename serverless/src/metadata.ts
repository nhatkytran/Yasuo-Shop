import fs from 'fs';
import path from 'path';
import util from 'util';

import type { Handler } from '@netlify/functions';
import readFileSync from './utils/readFileSync';

// Types //////////

type Metadata = { slides: { name: string; image: string }[] };

type Guest = {
  userAgent: string;
  timeAccess: number;
  updatedAt: Date;
  createdAt: Date;
};

// Helpers //////////

const filePath = (fileName: string) =>
  path.join(__dirname, `../data/${fileName}`);

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Data //////////

const metadata = readFileSync(filePath('metadata.json')) as Metadata;

// Handler //////////

const handleGuestsData = async (userAgent: string): Promise<void> => {
  const file = filePath('guests.json');

  const guestsData = JSON.parse(await readFileAsync(file, 'utf-8')) as Guest[];

  let isUpdated: Boolean = false;

  const guests = guestsData.map(guest => {
    if (guest.userAgent === userAgent) {
      isUpdated = true;

      return {
        ...guest,
        timeAccess: guest.timeAccess + 1,
        updatedAt: new Date(),
      };
    }

    return guest;
  });

  if (!isUpdated)
    guests.push({
      userAgent,
      timeAccess: 1,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

  await writeFileAsync(file, JSON.stringify(guests), 'utf-8');
};

const handler: Handler = async function (event, context, cb) {
  // await handleGuestsData(event.headers['user-agent'] as string);

  return { statusCode: 200, body: JSON.stringify(metadata) };
};

export { handler };
