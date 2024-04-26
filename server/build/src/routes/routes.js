"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = __importDefault(require("./user.route"));
const product_route_1 = __importDefault(require("./product.route"));
const session_route_1 = __importDefault(require("./session.route"));
const routes = (app) => {
    // Hello World
    app.get('/helloWorld', (_, res) => res.send('Hello World!'));
    // Health check route
    app.get('/', (req, res) => res.status(200).json({
        status: 'success',
        message: `This API is created by Trần Nhật Kỳ. Contact: nhockkutean2@gmail.com`,
    }));
    // Users, Signup, Update password,...
    app.use('/api/v1/users', user_route_1.default);
    // Signin, Authorization,...
    app.use('/api/v1/sessions', session_route_1.default);
    // Products -> stats, crud,...
    app.use('/api/v1/products', product_route_1.default);
};
exports.default = routes;
