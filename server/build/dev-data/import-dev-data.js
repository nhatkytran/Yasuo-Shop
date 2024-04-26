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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const config_1 = __importDefault(require("config"));
const productEnUs_model_1 = __importDefault(require("../src/models/products/productEnUs.model"));
const productFr_model_1 = __importDefault(require("../src/models/products/productFr.model"));
const getData = (fileName) => JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, fileName), 'utf-8'));
const getDataOther = (filename, originData) => {
    const dataOthers = getData(filename);
    return originData.map((data, index) => {
        const dataOther = dataOthers[index];
        let optional;
        if (data.optional) {
            optional = {
                optional: Object.assign(Object.assign({}, data.optional), dataOther.optional),
            };
        }
        let approximateDimensions;
        if (data.approximateDimensions) {
            approximateDimensions = {
                approximateDimensions: Object.assign(Object.assign({}, data.approximateDimensions), dataOther.approximateDimensions),
            };
        }
        return Object.assign(Object.assign(Object.assign(Object.assign({}, data), dataOther), (optional && optional)), (approximateDimensions && approximateDimensions));
    });
};
const productsDataEnUS = getData('./products/en-us.json');
const productDataFR = getDataOther('./products/fr.json', productsDataEnUS);
// yarn dev-data --import
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // products
        yield Promise.all([
            productEnUs_model_1.default.insertMany(productsDataEnUS),
            productFr_model_1.default.insertMany(productDataFR),
        ]);
        console.log('Data import - Successful!');
    }
    catch (error) {
        console.error('Data import - Failed!');
        console.error(error);
    }
    finally {
        process.exit();
    }
});
// yarn dev-data --delete
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // products
        yield Promise.all([productEnUs_model_1.default.deleteMany(), productFr_model_1.default.deleteMany()]);
        console.log('Data delete - Successful!');
    }
    catch (error) {
        console.error('Data delete - Failed!');
        console.error(error);
    }
    finally {
        process.exit();
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default
            .set('strictQuery', true)
            .connect(config_1.default.get('databaseURL'));
        console.log('Database connection - Successful!');
        switch (process.argv.at(-1)) {
            case '--import':
                importData();
                break;
            case '--delete':
                deleteData();
                break;
            default:
                console.error('Action (--import | --delete) missing!');
                process.exit();
        }
    }
    catch (error) {
        console.error('Something went wrong!');
        console.error(error);
    }
}))();
