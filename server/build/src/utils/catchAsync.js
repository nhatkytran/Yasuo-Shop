"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generic here because sometimes we want to define type of params, query,...
const catchAsync = (asyncCallback) => (req, res, next) => asyncCallback(req, res, next).catch(next);
exports.default = catchAsync;
