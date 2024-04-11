import createDB from "../src/utils/createDB";

const { DATABASE, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_COLLECTION_NAME } =
  process.env;

const databaseURL = createDB(DATABASE as string, {
  "<DATABASE_NAME>": DATABASE_NAME,
  "<DATABASE_PASSWORD>": DATABASE_PASSWORD,
  "<DATABASE_COLLECTION_NAME>": DATABASE_COLLECTION_NAME,
});

export default {
  port: 1337,
  databaseURL,
};
