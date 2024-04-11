const createDB = (DB: string, alters: object) =>
  Object.entries(alters).reduce(
    (acc, [key, value]) => acc.replace(key, value),
    DB
  );

export default createDB;
