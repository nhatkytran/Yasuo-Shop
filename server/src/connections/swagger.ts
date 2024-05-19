import path from 'path';
import fs from 'fs';
import { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yaml';

const file = fs.readFileSync(path.resolve('./src/swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);

const swagger = (app: Express) =>
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default swagger;
