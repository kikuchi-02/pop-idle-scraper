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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishDates = void 0;
var axios_1 = __importDefault(require("axios"));
var cache_1 = require("../cache");
var getHolydaies = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cacher, holydaies, url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cacher = new cache_1.Cacher('holydaies');
                holydaies = cacher.getCache();
                if (holydaies) {
                    return [2 /*return*/, holydaies.map(function (d) { return new Date(d); })];
                }
                url = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _a.sent();
                holydaies = response.data
                    .split('\n')
                    .reduce(function (acc, curr) {
                    if (/^\d{4}\/(\d{1}|\d{2})\/(\d{1}|\d{2}),/.test(curr)) {
                        var d = curr.split(',')[0];
                        if (d) {
                            acc.push(d);
                        }
                    }
                    return acc;
                }, []);
                if (holydaies) {
                    cacher.saveCache(holydaies);
                    return [2 /*return*/, holydaies.map(function (d) { return new Date(d); })];
                }
                else {
                    return [2 /*return*/, []];
                }
                return [2 /*return*/];
        }
    });
}); };
var isDayOff = function (date, holidaies) {
    // weekend
    if ([0, 6].includes(date.getDay())) {
        return true;
    }
    // holiday
    if (holidaies.find(function (holiday) {
        return holiday.getDate() === date.getDate() &&
            holiday.getMonth() === date.getMonth() &&
            holiday.getFullYear() === date.getFullYear();
    })) {
        return true;
    }
    return false;
};
var publishDates = function () { return __awaiter(void 0, void 0, void 0, function () {
    var holydaies, today, accdate, targetDate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getHolydaies()];
            case 1:
                holydaies = _a.sent();
                today = new Date();
                if (isDayOff(today, holydaies)) {
                    return [2 /*return*/, []];
                }
                accdate = [];
                targetDate = new Date();
                targetDate.setDate(targetDate.getDate() - 1);
                while (isDayOff(targetDate, holydaies) && accdate.length < 5) {
                    // clone
                    accdate.push(new Date(targetDate.getTime()));
                    targetDate.setDate(targetDate.getDate() - 1);
                }
                return [2 /*return*/, accdate];
        }
    });
}); };
exports.publishDates = publishDates;
