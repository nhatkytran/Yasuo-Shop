"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const appError_1 = __importDefault(require("../utils/appError"));
const trackLanguage = (req, res, next) => {
    const language = req.query.language;
    if (language && !config_1.default.get('languageSupport').includes(language))
        throw new appError_1.default({
            message: `Language '${language}' is not supported!`,
            statusCode: 400,
        });
    res.locals.language = language || config_1.default.get('defaultLanguage');
    next();
};
exports.default = trackLanguage;
