"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createDB = (DB, alters) => Object.entries(alters).reduce((acc, [key, value]) => acc.replace(key, value), DB);
exports.default = createDB;
