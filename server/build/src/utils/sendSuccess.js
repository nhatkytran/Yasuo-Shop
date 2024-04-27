"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const sendSuccess = (res, _a) => {
    var { statusCode } = _a, others = __rest(_a, ["statusCode"]);
    return res.status(statusCode || 200).json(Object.assign({ status: 'success' }, (0, lodash_1.omit)(others, 'statusCode')));
};
exports.default = sendSuccess;
