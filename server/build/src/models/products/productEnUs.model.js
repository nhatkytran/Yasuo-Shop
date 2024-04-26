"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schemaDefs_1 = require("./schemaDefs");
const commonDefs_1 = require("../commonDefs");
const schema = new mongoose_1.default.Schema(schemaDefs_1.schemaDefs, commonDefs_1.schemaSups);
(0, schemaDefs_1.virtutalProperties)(schema);
const ProductEnUS = mongoose_1.default.model('ProductEnUS', schema, 'productEnUS');
exports.default = ProductEnUS;
