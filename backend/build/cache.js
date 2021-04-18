"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cacher = void 0;
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
