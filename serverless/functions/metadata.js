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
exports.handler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const readFileSync_1 = __importDefault(require("./utils/readFileSync"));
// Helpers //////////
const filePath = (fileName) => path_1.default.join(__dirname, `../data/${fileName}`);
const readFileAsync = util_1.default.promisify(fs_1.default.readFile);
const writeFileAsync = util_1.default.promisify(fs_1.default.writeFile);
// Data //////////
const metadata = (0, readFileSync_1.default)(filePath('metadata.json'));
// Handler //////////
const handleGuestsData = (userAgent) => __awaiter(void 0, void 0, void 0, function* () {
    const file = filePath('guests.json');
    const guestsData = JSON.parse(yield readFileAsync(file, 'utf-8'));
    let isUpdated = false;
    const guests = guestsData.map(guest => {
        if (guest.userAgent === userAgent) {
            isUpdated = true;
            return Object.assign(Object.assign({}, guest), { timeAccess: guest.timeAccess + 1, updatedAt: new Date() });
        }
        return guest;
    });
    if (!isUpdated)
        guests.push({
            userAgent,
            timeAccess: 1,
            updatedAt: new Date(),
            createdAt: new Date(),
        });
    yield writeFileAsync(file, JSON.stringify(guests), 'utf-8');
});
const handler = function (event, context, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(process.env.NODE_ENV);
        // await handleGuestsData(event.headers['user-agent'] as string);
        return { statusCode: 200, body: JSON.stringify(metadata) };
    });
};
exports.handler = handler;
