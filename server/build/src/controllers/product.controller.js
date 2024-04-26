"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createNewProduct = exports.getProduct = exports.getAllProducts = exports.aliasTopProducts = exports.getProductEditions = exports.getProductStats = void 0;
const env_1 = __importDefault(require("../utils/env"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const sendSuccess_1 = __importDefault(require("../utils/sendSuccess"));
const product_service_1 = require("../services/product.service");
// ADVANCED //////////
exports.getProductStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = res.locals.language;
    const stats = yield (0, product_service_1.calcProductStats)(language);
    (0, sendSuccess_1.default)(res, { language, stats });
}));
exports.getProductEditions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = res.locals.language;
    const products = yield (0, product_service_1.findProductEditions)(language);
    (0, sendSuccess_1.default)(res, { language, products });
}));
const aliasTopProducts = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    next();
};
exports.aliasTopProducts = aliasTopProducts;
// CRUD //////////
exports.getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.default.dev)
        console.log('req.query ->', req.query);
    const language = res.locals.language;
    const products = yield (0, product_service_1.findAllProducts)({ language, reqQuery: req.query });
    (0, sendSuccess_1.default)(res, { language, numResults: products.length, products });
}));
exports.getProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = res.locals.language;
    const { productID } = req.params;
    const options = Object.assign({}, req.query);
    if (env_1.default.dev)
        console.log(productID, options);
    const product = yield (0, product_service_1.findProductByID)({ language, productID, options });
    (0, sendSuccess_1.default)(res, { language, numResults: 1, product });
}));
exports.createNewProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = res.locals.language;
    const input = Object.assign({}, req.body);
    const product = yield (0, product_service_1.createProduct)({ language, input });
    (0, sendSuccess_1.default)(res, { statusCode: 201, language, numResults: 1, product });
}));
exports.updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = res.locals.language;
    const productID = req.params.productID;
    const update = Object.assign({}, req.body);
    const product = yield (0, product_service_1.findAndUpdateProduct)({
        language,
        productID,
        update,
        options: { new: true, runValidators: true },
    });
    (0, sendSuccess_1.default)(res, { language, numResults: product ? 1 : 0, product });
}));
exports.deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const language = res.locals.language;
    const productID = req.params.productID;
    yield (0, product_service_1.findAndDeleteProduct)({ language, productID });
    (0, sendSuccess_1.default)(res, {
        statusCode: 204,
        language,
        numResults: 0,
        product: null,
    });
}));
