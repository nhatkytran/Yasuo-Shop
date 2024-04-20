import mongoose from 'mongoose';

import { SessionDocument, schemaDefs } from './schemaDefs';
import { schemaSups } from '../commonDefs';

const schema = new mongoose.Schema<SessionDocument>(schemaDefs, schemaSups);
const Session = mongoose.model<SessionDocument>('Session', schema, 'sessions');

export default Session;
