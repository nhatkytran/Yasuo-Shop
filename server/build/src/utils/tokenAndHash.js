"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = exports.hashToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const hashToken = (token) => crypto_1.default.createHash('sha256').update(token).digest('hex');
exports.hashToken = hashToken;
const createTokens = ({ timeoutMinute, } = {}) => {
    const token = crypto_1.default.randomBytes(6).toString('hex');
    let hash = (0, exports.hashToken)(token);
    if (timeoutMinute)
        hash = `${hash}/${Date.now() + timeoutMinute * 60 * 1000}`;
    return { token, hash };
};
exports.createTokens = createTokens;
