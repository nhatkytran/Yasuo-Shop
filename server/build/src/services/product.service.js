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
exports.findAndDeleteProduct = exports.findAndUpdateProduct = exports.createProduct = exports.findProductByID = exports.findAllProducts = exports.findProductEditions = exports.calcProductStats = void 0;
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const removeEmptyArray_1 = __importDefault(require("../utils/removeEmptyArray"));
const appError_1 = __importDefault(require("../utils/appError"));
const productEnUs_model_1 = __importDefault(require("../models/products/productEnUs.model"));
const productFr_model_1 = __importDefault(require("../models/products/productFr.model"));
// Helper functions //////////
const getProductModel = (language) => {
    let ProductModel = productEnUs_model_1.default; // 'en-us'
    if (language === 'fr')
        ProductModel = productFr_model_1.default;
    return ProductModel;
};
const priceDefault = '$price.default';
const saleAmount = '$price.saleAmount';
const priceAlterSale = { $subtract: ['$price.default', '$price.saleAmount'] };
const statsGroupItems = {
    numProducts: { $sum: 1 },
    productID: { $push: '$_id' },
    ratingsAverage: { $sum: '$ratingsAverage' },
    avgShippingDays: { $avg: '$shippingDays' },
    avgPrice: { $avg: priceDefault },
    minPrice: { $min: priceDefault },
    maxPrice: { $max: priceDefault },
    avgSaleAmount: { $avg: saleAmount },
    minSaleAmount: { $min: saleAmount },
    maxSaleAmount: { $max: saleAmount },
    avgPriceAfterSale: { $avg: priceAlterSale },
    minPriceAfterSale: { $min: priceAlterSale },
    maxPriceAfterSale: { $max: priceAlterSale },
};
const calcProductStats = (language) => __awaiter(void 0, void 0, void 0, function* () {
    const ProductModel = getProductModel(language);
    let currency = 'USD';
    if (language === 'fr')
        currency = 'EUR';
    return yield ProductModel.aggregate([
        { $match: {} }, // Match all documents
        { $group: Object.assign({ _id: { $toUpper: '$category' } }, statsGroupItems) },
        { $addFields: { currency } },
        { $sort: { numProducts: 1, avgPrice: 1 } },
    ]);
});
exports.calcProductStats = calcProductStats;
const findProductEditions = (language) => __awaiter(void 0, void 0, void 0, function* () {
    const ProductModel = getProductModel(language);
    let currency = 'USD';
    if (language === 'fr')
        currency = 'EUR';
    let groupID = `$editions.${language === 'en-us' ? 'en' : 'other'}`;
    return yield ProductModel.aggregate([
        // preserveNullAndEmptyArrays: true
        // There are products that don't have any edition
        { $unwind: { path: groupID, preserveNullAndEmptyArrays: true } },
        { $group: Object.assign({ _id: { $toUpper: groupID } }, statsGroupItems) },
        { $addFields: { currency } },
        { $sort: { numProducts: -1 } },
    ]);
});
exports.findProductEditions = findProductEditions;
const findAllProducts = (_a) => __awaiter(void 0, [_a], void 0, function* ({ language, reqQuery = {}, findOptions = {}, }) {
    const ProductModel = getProductModel(language);
    const features = yield (0, apiFeatures_1.default)({
        model: ProductModel,
        reqQuery,
        findOptions,
    });
    features.filter().sort().project().paginate();
    const products = yield features.result();
    return products.map(product => (0, removeEmptyArray_1.default)(product.toJSON()));
});
exports.findAllProducts = findAllProducts;
const findProductByID = (_b) => __awaiter(void 0, [_b], void 0, function* ({ language, productID, options = {}, }) {
    const ProductModel = getProductModel(language);
    // { name: true, price.default: true,... } -> projecting
    let selectOptions = {};
    let { fields } = options;
    if (fields) {
        if (!Array.isArray(fields))
            fields = fields.split(',');
        fields.forEach(field => (selectOptions[field] = true));
    }
    const product = yield ProductModel.findById(productID, selectOptions);
    if (!product)
        throw new appError_1.default({ message: 'Product not found!', statusCode: 404 });
    return (0, removeEmptyArray_1.default)(product.toJSON());
});
exports.findProductByID = findProductByID;
const createProduct = (_c) => __awaiter(void 0, [_c], void 0, function* ({ language, input }) {
    const ProductModel = getProductModel(language);
    const product = yield ProductModel.create(input);
    return (0, removeEmptyArray_1.default)(product.toJSON());
});
exports.createProduct = createProduct;
const findAndUpdateProduct = (_d) => __awaiter(void 0, [_d], void 0, function* ({ language, productID, update, options, }) {
    const ProductModel = getProductModel(language);
    const product = yield ProductModel.findByIdAndUpdate(productID, update, options);
    if (!product)
        return null;
    return (0, removeEmptyArray_1.default)(product.toJSON());
});
exports.findAndUpdateProduct = findAndUpdateProduct;
const findAndDeleteProduct = (_e) => __awaiter(void 0, [_e], void 0, function* ({ language, productID, }) {
    const ProductModel = getProductModel(language);
    yield ProductModel.findByIdAndDelete(productID);
});
exports.findAndDeleteProduct = findAndDeleteProduct;
