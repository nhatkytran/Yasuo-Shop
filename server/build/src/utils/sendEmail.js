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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const html_to_text_1 = require("html-to-text");
const config_1 = __importDefault(require("config"));
const env_1 = __importDefault(require("./env"));
const emailAuthor = config_1.default.get('emailAuthor');
const mailtrapHost = config_1.default.get('mailtrapHost');
const mailtrapPort = config_1.default.get('mailtrapPort');
const mailtrapUsername = config_1.default.get('mailtrapUsername');
const mailtrapPassword = config_1.default.get('mailtrapPassword');
const brevoHost = config_1.default.get('brevoHost');
const brevoPort = config_1.default.get('brevoPort');
const brevoKeyName = config_1.default.get('brevoKeyName');
const brevoKeyValue = config_1.default.get('brevoKeyValue');
class Email {
    constructor(user) {
        this.from = `Trần Nhật Kỳ - ${emailAuthor}`;
        this.to = user.email;
        this.username = user.name || '';
    }
    newTransport() {
        const [host, port, user, pass] = env_1.default.dev || env_1.default.test
            ? [mailtrapHost, mailtrapPort, mailtrapUsername, mailtrapPassword]
            : [brevoHost, brevoPort, brevoKeyName, brevoKeyValue];
        return nodemailer_1.default.createTransport({ host, port, auth: { user, pass } });
    }
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { template, subject } = options, locals = __rest(options, ["template", "subject"]);
            const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, `../views/baseEmail.ejs`), Object.assign({ subject, template }, locals));
            yield this.newTransport().sendMail({
                from: this.from,
                to: this.to,
                subject,
                html,
                text: (0, html_to_text_1.convert)(html, { wordwrap: null }),
            });
        });
    }
    sendWelcome(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { oAuth, code } = options;
            const subject = oAuth
                ? ''
                : ' Your activate code (only valid for only 2 minutes)';
            yield this.send({
                template: 'welcomeEmail',
                subject: `Welcome!${subject}`,
                username: this.username,
                code,
            });
        });
    }
    sendActivate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code }) {
            yield this.send({
                template: 'activateEmail',
                subject: 'Yasuo API - Yasuo Shop! Activate code',
                username: this.username,
                code,
            });
        });
    }
    sendForgotPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code }) {
            yield this.send({
                template: 'forgotPasswordEmail',
                subject: 'Yasuo API - Yasuo Shop! Forgot password code',
                username: this.username,
                code,
            });
        });
    }
}
exports.default = Email;
