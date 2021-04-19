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
exports.searchTweets = exports.createPuppeteerCluster = exports.scrape = exports.switchTwitterAccount = void 0;
var puppeteer_cluster_1 = require("puppeteer-cluster");
var sites_1 = require("./scraper-utils/sites");
var twitter_v2_1 = __importDefault(require("twitter-v2"));
var utils_1 = require("./scraper-utils/utils");
var switchSite = function (site) {
    switch (site) {
        case 'nogizaka-koshiki':
            return sites_1.nogizakaKoshiki;
        case 'nogizaka-blog':
            return sites_1.nogizakaBlog;
        case 'sakurazaka-koshiki':
            return sites_1.sakurazakaKoshiki;
        case 'sakurazaka-blog':
            return sites_1.sakurazakaBlog;
        case 'hinatazaka-koshiki':
            return sites_1.hinatazakaKoshiki;
        case 'hinatazaka-blog':
            return sites_1.hinatazakaBlog;
        default:
            throw Error("not implemented type " + site);
    }
};
var switchTwitterAccount = function (idle) {
    switch (idle) {
        case 'nogizaka':
            return 'nogizaka46';
        case 'sakurazaka':
            return 'sakurazaka46';
        case 'hinatazaka':
            return 'hinatazaka46';
        default:
            throw Error("not implemented type " + idle);
    }
};
exports.switchTwitterAccount = switchTwitterAccount;
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
                            post.hDate = utils_1.formatDate(post.date);
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
                        args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ja-JA,ja'],
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
var searchTweets = function (settings, account) { return __awaiter(void 0, void 0, void 0, function () {
    var twitterClient, response, tweets;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    twitterClient = new twitter_v2_1.default({
                        bearer_token: settings.TWITTER_BEARER_TOKEN,
                    });
                }
                catch (e) {
                    console.error('error arround twitter keys', e);
                    return [2 /*return*/, undefined];
                }
                return [4 /*yield*/, twitterClient
                        .get('tweets/search/recent', {
                        query: "from: \"" + account + "\"",
                        max_results: '10',
                        tweet: {
                            fields: ['created_at'],
                        },
                    })
                        .catch(function (err) {
                        console.error("got error while searching tweets: " + account);
                        return undefined;
                    })];
            case 1:
                response = _a.sent();
                if (!response) {
                    return [2 /*return*/, { siteTitle: account }];
                }
                tweets = response.data.map(function (tweet) {
                    var date = new Date(tweet.created_at).getTime();
                    var text = tweet.text
                        .split('\n')
                        .map(function (s) { return s.trim(); })
                        .join();
                    var title = utils_1.urlify(text);
                    var hDate = utils_1.formatDate(date);
                    return { date: date, title: title, hDate: hDate };
                });
                return [2 /*return*/, { siteTitle: account, posts: tweets }];
        }
    });
}); };
exports.searchTweets = searchTweets;
