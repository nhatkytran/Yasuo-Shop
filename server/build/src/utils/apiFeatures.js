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
Object.defineProperty(exports, "__esModule", { value: true });
// Help refactor findAllProducts code -> /src/services/product.service.ts
const APIFeatures = (_a) => __awaiter(void 0, [_a], void 0, function* ({ model, reqQuery, findOptions = {}, }) {
    // Actions like finding product that has price > 100
    const filterQuery = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(Object.assign({}, reqQuery)).replace(/\b(gte?|lte?)\b/g, match => `$${match}`))), findOptions);
    const totalDocuments = yield model.countDocuments(filterQuery);
    return new ClsAPIFeatures(model.find(), filterQuery, totalDocuments);
});
class ClsAPIFeatures {
    constructor(query, filterQuery, totalDocuments) {
        this.query = query;
        this.filterQuery = filterQuery;
        this.totalDocuments = totalDocuments;
        this.convertCond = (cond) => {
            if (!cond)
                return;
            if (Array.isArray(cond))
                return cond.join(' ');
            return cond.split(',').join(' ');
        };
        this.result = () => this.query;
        this.query = query;
        this.filterQuery = filterQuery;
        this.totalDocuments = totalDocuments;
    }
    filter() {
        this.query = this.query.find(this.filterQuery);
        return this;
    }
    sort() {
        // _id' -> The order as in the database
        this.query = this.query.sort(this.convertCond(this.filterQuery.sort) || '_id');
        return this;
    }
    project() {
        this.query = this.query.select(this.convertCond(this.filterQuery.fields) || '-__v');
        return this;
    }
    paginate() {
        if (this.filterQuery.page || this.filterQuery.limit) {
            let page = Math.abs(Number.parseInt(this.filterQuery.page)) || 1;
            const limit = Math.abs(Number.parseInt(this.filterQuery.limit)) || 6;
            const pages = Math.ceil(this.totalDocuments / limit);
            if (page > pages)
                page = pages;
            this.query = this.query.skip((page - 1) * limit).limit(limit);
        }
        return this;
    }
}
exports.default = APIFeatures;
