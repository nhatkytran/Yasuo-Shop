"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
// All errors happening in synchronous code -> nodejs process is in unclean state
process.on('uncaughtException', error => {
    logger_1.default.error(error, '--- UNCAUGHT EXCEPTION! Shutting down... ---');
    process.exit(1);
});
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Config .env file -> process.env
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const config_1 = __importDefault(require("config"));
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./connections/database"));
const env_1 = __importDefault(require("./utils/env"));
// Run Express app
const app = (0, app_1.default)();
// Run server at port 1337
const port = config_1.default.get('port') || 1337;
const server = app.listen(port, () => {
    logger_1.default.info(`App is running at port ${port}...`);
    // Connect MongoDB Cloud - Atlas
    (0, database_1.default)();
});
// There is a promise that got rejected but it has not been handled
process.on('unhandledRejection', error => {
    logger_1.default.error(error, '--- UNHANDLED REJECTION! Shutting down... ---');
    // number 0 -> exit after success
    // number 1 -> some kind of error and give more information about it
    server.close(() => process.exit(1));
});
// In dev mode, SIGTERM is triggered maybe because of ts-node-dev
if (env_1.default.prod)
    // The NodeJS process is killed
    process.on('SIGTERM', () => {
        logger_1.default.info('--- SIGTERM RECEIVED! Shutting down... ---');
        if (server)
            server.close(() => logger_1.default.info('SIGTERM - Process terminated!'));
    });
