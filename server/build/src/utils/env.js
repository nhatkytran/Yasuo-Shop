"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { NODE_ENV } = process.env;
const env = new (class Env {
    get dev() {
        return NODE_ENV === 'development';
    }
    get test() {
        return NODE_ENV === 'test';
    }
    get prod() {
        return NODE_ENV === 'production';
    }
})();
exports.default = env;
