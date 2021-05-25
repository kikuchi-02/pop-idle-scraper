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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.Cacher = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var Cacher = /** @class */ (function () {
    function Cacher(key) {
        this.cacheFilePath = path_1.join(process.cwd(), 'cache', key + ".buff");
        this.getCacheFromFile();
    }
    Cacher.prototype.getCacheFromFile = function () {
        try {
            fs_1.accessSync(this.cacheFilePath, fs_1.constants.R_OK);
        }
        catch (_) {
            return;
        }
        var data = fs_1.readFileSync(this.cacheFilePath, 'utf-8');
        this.cacheValue = JSON.parse(data);
    };
    Cacher.prototype.getCache = function () {
        if (this.cacheValue) {
            if (!this.cacheValue.expireDate) {
                return this.cacheValue.value;
            }
            if (this.cacheValue.expireDate - Date.now() > 0) {
                return this.cacheValue.value;
            }
        }
        return undefined;
    };
    Cacher.prototype.saveCache = function (data, expireDate) {
        if (expireDate === void 0) { expireDate = null; }
        this.cacheValue = {
            value: data,
            expireDate: expireDate ? expireDate.getTime() : null,
        };
        var str = JSON.stringify(this.cacheValue);
        fs_1.writeFile(this.cacheFilePath, str, function (err) {
            console.error(err);
        });
    };
    return Cacher;
}());
exports.Cacher = Cacher;
function getCache(key, expiration, func, forceNew) {
    if (forceNew === void 0) { forceNew = false; }
    return __awaiter(this, void 0, void 0, function () {
        var cacher, cache, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacher = new Cacher(key);
                    if (!forceNew) {
                        cache = cacher.getCache();
                        if (cache) {
                            return [2 /*return*/, cache];
                        }
                    }
                    return [4 /*yield*/, func()];
                case 1:
                    value = _a.sent();
                    if (!value) {
                        return [2 /*return*/, undefined];
                    }
                    cacher.saveCache(value, expiration);
                    return [2 /*return*/, value];
            }
        });
    });
}
exports.getCache = getCache;
