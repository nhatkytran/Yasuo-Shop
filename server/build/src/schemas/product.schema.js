"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductSchema = exports.updateProductSchema = exports.getProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const payloadOptional = {
    ratingsAverage: (0, zod_1.number)().min(1).max(5).optional(),
    ratingsQuantity: (0, zod_1.number)().int().min(0).optional(),
    editions: (0, zod_1.object)({
        en: (0, zod_1.array)((0, zod_1.union)([
            (0, zod_1.literal)('limited edition'),
            (0, zod_1.literal)('preorder'),
            (0, zod_1.literal)('special edition'),
        ])),
        other: (0, zod_1.array)((0, zod_1.string)()).optional(),
    }).optional(),
    optional: (0, zod_1.object)({ title: (0, zod_1.string)(), image: (0, zod_1.string)() }).optional(),
    sizes: (0, zod_1.array)((0, zod_1.string)()).optional(),
    platforms: (0, zod_1.array)((0, zod_1.string)()).optional(),
    regions: (0, zod_1.array)((0, zod_1.string)()).optional(),
    check: (0, zod_1.string)().optional(),
    warning: (0, zod_1.string)().optional(),
    shippingDays: (0, zod_1.number)().optional(),
    quote: (0, zod_1.string)().optional(),
    features: (0, zod_1.array)((0, zod_1.string)()).optional(),
    approximateDimensions: (0, zod_1.object)({
        value: (0, zod_1.array)((0, zod_1.array)((0, zod_1.number)())),
        en: (0, zod_1.array)((0, zod_1.union)([(0, zod_1.literal)('height'), (0, zod_1.literal)('width'), (0, zod_1.literal)('depth')])),
        other: (0, zod_1.array)((0, zod_1.string)()).optional(),
    }).optional(),
    funFact: (0, zod_1.string)().optional(),
    series: (0, zod_1.string)().optional(),
    materials: (0, zod_1.array)((0, zod_1.string)()).optional(),
};
const Name = (0, zod_1.string)();
const Price = (0, zod_1.object)({
    default: (0, zod_1.number)(),
    saleAmount: (0, zod_1.number)().gte(0).optional(),
    currency: (0, zod_1.string)().optional(),
}).refine(price => {
    if (!price.saleAmount)
        return true;
    return price.saleAmount <= price.default;
}, {
    message: 'Sale amount cannot be greater than default price',
    path: ['saleAmount'],
});
const Images = (0, zod_1.array)((0, zod_1.string)());
const Type = (0, zod_1.literal)('figure')
    .or((0, zod_1.literal)('game'))
    .or((0, zod_1.literal)('cloth'))
    .or((0, zod_1.literal)('item'));
const Category = (0, zod_1.literal)('featured').or((0, zod_1.literal)('sale'));
const Descriptions = (0, zod_1.array)((0, zod_1.string)().or((0, zod_1.array)((0, zod_1.string)())));
const params = {
    params: (0, zod_1.object)({
        productID: (0, zod_1.string)({ required_error: `Product's ID is required` }),
    }),
};
exports.createProductSchema = (0, zod_1.object)({
    body: (0, zod_1.object)(Object.assign({ name: Name, price: Price, images: Images, type: Type, category: Category, descriptions: Descriptions }, payloadOptional)),
});
exports.getProductSchema = (0, zod_1.object)(Object.assign({}, params));
exports.updateProductSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), { body: (0, zod_1.object)(Object.assign({ name: Name.optional(), price: Price.optional(), images: Images.optional(), type: Type.optional(), category: Category.optional(), descriptions: Descriptions.optional() }, payloadOptional)) }));
exports.deleteProductSchema = (0, zod_1.object)(Object.assign({}, params));
