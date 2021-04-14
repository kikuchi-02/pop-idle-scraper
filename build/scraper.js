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
exports.scrapeAll = exports.createPuppeteerCluster = exports.scrape = void 0;
var puppeteer_cluster_1 = require("puppeteer-cluster");
var typing_1 = require("./typing");
var sites_1 = require("./scraper-utils/sites");
var formatDate = function (_date) {
    var date = new Date(_date);
    var str = ("0" + (date.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + date.getDate()).slice(-2) +
        " " +
        ("(" + ["日", "月", "火", "水", "木", "金", "土"][date.getDay()] + ")");
    return str;
};
var switchSite = function (site) {
    switch (site) {
        case "nogizaka-koshiki":
            return sites_1.nogizakaKoshiki;
        case "nogizaka-blog":
            return sites_1.nogizakaBlog;
        case "sakurazaka-koshiki":
            return sites_1.sakurazakaKoshiki;
        case "sakurazaka-blog":
            return sites_1.sakurazakaBlog;
        case "hinatazaka-koshiki":
            return sites_1.hinatazakaKoshiki;
        case "hinatazaka-blog":
            return sites_1.hinatazakaBlog;
        default:
            throw Error("not implemented type " + site);
    }
};
var scrape = function (_a) {
    var page = _a.page, data = _a.data;
    return __awaiter(void 0, void 0, void 0, function () {
        var scrapedResult;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("start " + data.site);
                    return [4 /*yield*/, switchSite(data.site)(page).catch(function (err) {
                            console.error("got error while scraping: " + data.site);
                            return { siteTitle: data.site };
                        })];
                case 1:
                    scrapedResult = _b.sent();
                    (scrapedResult.posts || []).forEach(function (post) {
                        if (post.date) {
                            post.hDate = formatDate(post.date);
                        }
                    });
                    console.log("end " + data.site);
                    return [2 /*return*/, scrapedResult];
            }
        });
    });
};
exports.scrape = scrape;
var createPuppeteerCluster = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cluster;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer_cluster_1.Cluster.launch({
                    concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_CONTEXT,
                    maxConcurrency: 5,
                    puppeteerOptions: {
                        args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=ja-JA,ja"],
                    },
                })];
            case 1:
                cluster = _a.sent();
                return [4 /*yield*/, cluster.task(exports.scrape)];
            case 2:
                _a.sent();
                return [2 /*return*/, cluster];
        }
    });
}); };
exports.createPuppeteerCluster = createPuppeteerCluster;
var scrapeAll = function (cluster, kinds) { return __awaiter(void 0, void 0, void 0, function () {
    var sites, scarpedResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("scraping now");
                sites = typing_1.siteNames.filter(function (site) {
                    return kinds.some(function (kind) { return site.startsWith(kind); });
                });
                return [4 /*yield*/, Promise.all(sites.map(function (site) { return cluster.execute({ site: site }); })).then(function (results) {
                        var cache = { date: Date.now() };
                        kinds.forEach(function (kind) {
                            cache[kind] = [];
                            sites.forEach(function (site, index) {
                                var _a;
                                if (site.startsWith(kind)) {
                                    (_a = cache[kind]) === null || _a === void 0 ? void 0 : _a.push(results[index]);
                                }
                            });
                        });
                        return cache;
                    })];
            case 1:
                scarpedResult = _a.sent();
                console.log("scraping finish");
                return [2 /*return*/, scarpedResult];
        }
    });
}); };
exports.scrapeAll = scrapeAll;
