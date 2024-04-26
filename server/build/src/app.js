"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const hpp_1 = __importDefault(require("hpp"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("config"));
const routes_1 = __importDefault(require("./routes/routes"));
const trackLanguage_1 = __importDefault(require("./middleware/trackLanguage"));
const appError_1 = __importDefault(require("./utils/appError"));
const error_controller_1 = __importDefault(require("./controllers/error.controller"));
const env_1 = __importDefault(require("./utils/env"));
const init = () => {
    const app = (0, express_1.default)();
    // GET /route 304 9.789 ms - - -> Route information
    if (env_1.default.dev)
        app.use((0, morgan_1.default)('dev'));
    // Config static files
    app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    // Parse data for req.body and multipart form
    app.use(express_1.default.json({ limit: '10kb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
    // Parse cookie
    app.use((0, cookie_parser_1.default)());
    // Set EJS as the view engine and set views directory
    app.set('view engine', 'ejs');
    app.set('views', path_1.default.join(__dirname, 'views'));
    // Prevent parameter polution
    app.use((0, hpp_1.default)({ whitelist: config_1.default.get('parameterWhiteList') }));
    // Check query 'language', default: 'en-us'
    app.use(trackLanguage_1.default);
    // Routes: product, user,...
    (0, routes_1.default)(app);
    // Unhandled routes
    app.all('*', (req, _, next) => next(new appError_1.default({
        message: `${req.originalUrl} not found!`,
        statusCode: 404,
    })));
    // Handle Global Error
    app.use(error_controller_1.default);
    return app;
};
exports.default = init;
