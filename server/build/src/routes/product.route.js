"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const product_controller_1 = require("../controllers/product.controller");
const product_schema_1 = require("../schemas/product.schema");
const session_controller_1 = require("../controllers/session.controller");
const productsRouter = express_1.default.Router();
// ADVANCED //////////
productsRouter.get('/top-5-cheap', product_controller_1.aliasTopProducts, product_controller_1.getAllProducts);
productsRouter.get('/statsCategory', session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'), product_controller_1.getProductStats);
productsRouter.get('/statsEditions', session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'), product_controller_1.getProductEditions);
// CRUD //////////
productsRouter
    .route('/')
    .get(product_controller_1.getAllProducts)
    .post(session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'), (0, validateResource_1.default)(product_schema_1.createProductSchema), product_controller_1.createNewProduct);
productsRouter
    .route('/:productID')
    .get((0, validateResource_1.default)(product_schema_1.getProductSchema), product_controller_1.getProduct)
    .patch(session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'), (0, validateResource_1.default)(product_schema_1.updateProductSchema), product_controller_1.updateProduct)
    .delete(session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'), (0, validateResource_1.default)(product_schema_1.deleteProductSchema), product_controller_1.deleteProduct);
exports.default = productsRouter;
