import fs from 'fs';
import path from 'path';

const readFileSync = (filePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(filePath), 'utf-8'));

export default readFileSync;
