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
exports.hinatazakaBlog = exports.hinatazakaKoshiki = exports.sakurazakaBlog = exports.sakurazakaKoshiki = exports.nogizakaBlog = exports.nogizakaKoshiki = void 0;
var utils_1 = require("./utils");
var defaultLimit = 7;
var nogizakaKoshiki = function (page, limit) {
    if (limit === void 0) { limit = defaultLimit; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, posts, siteTitle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "http://www.nogizaka46.com/news/";
                    return [4 /*yield*/, utils_1.setLanguage(page)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page
                            .$$eval("#N0 > div.padding > ul > li", function (elements) {
                            return elements.map(function (elm) {
                                var _a, _b, _c, _d;
                                var obj = {};
                                var title = (_a = elm.querySelector(".title")) === null || _a === void 0 ? void 0 : _a.textContent;
                                if (title) {
                                    obj.title = title;
                                }
                                var summary = (((_b = elm.querySelector(".summary")) === null || _b === void 0 ? void 0 : _b.textContent) || "")
                                    .split("\n")
                                    .reduce(function (p, c) {
                                    c = c.trim();
                                    if (c) {
                                        p += c;
                                    }
                                    return p;
                                }, "");
                                if (summary) {
                                    obj.summary = summary;
                                }
                                var date = (_c = elm.querySelector(".date")) === null || _c === void 0 ? void 0 : _c.textContent;
                                if (date) {
                                    obj.date = new Date(date).getTime();
                                }
                                var link = (_d = elm.querySelector("a")) === null || _d === void 0 ? void 0 : _d.getAttribute("href");
                                if (link) {
                                    obj.link = link;
                                }
                                return obj;
                            });
                        })
                            .then(function (_posts) { return _posts.slice(0, limit); })];
                case 3:
                    posts = _a.sent();
                    return [4 /*yield*/, page.title()];
                case 4:
                    siteTitle = _a.sent();
                    return [2 /*return*/, { siteTitle: siteTitle, posts: posts }];
            }
        });
    });
};
exports.nogizakaKoshiki = nogizakaKoshiki;
var nogizakaBlog = function (page, limit) {
    if (limit === void 0) { limit = defaultLimit; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, heads, bodies, posts, index, _a, date, author, title, link, body, siteTitle;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = "http://blog.nogizaka46.com/";
                    return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, page.$$("#sheet > h1")];
                case 2:
                    heads = _b.sent();
                    return [4 /*yield*/, page.$$("#sheet > div[class=entrybody]")];
                case 3:
                    bodies = _b.sent();
                    posts = [];
                    index = 0;
                    _b.label = 4;
                case 4:
                    if (!(index < heads.length)) return [3 /*break*/, 8];
                    return [4 /*yield*/, page.evaluate(function (elm) {
                            var _a, _b, _c, _d, _e;
                            var yearmonth = (_a = elm.querySelector(".yearmonth")) === null || _a === void 0 ? void 0 : _a.textContent;
                            var _date = (_b = elm.querySelector(".dd1")) === null || _b === void 0 ? void 0 : _b.textContent;
                            var date = new Date(yearmonth.split("/")[0], yearmonth.split("/")[1], _date).getTime();
                            var author = (_c = elm.querySelector(".author")) === null || _c === void 0 ? void 0 : _c.textContent;
                            var title = (_d = elm.querySelector(".entrytitle")) === null || _d === void 0 ? void 0 : _d.textContent;
                            var link = (_e = elm.querySelector(".entrytitle > a")) === null || _e === void 0 ? void 0 : _e.getAttribute("href");
                            return { date: date, author: author, title: title, link: link };
                        }, heads[index])];
                case 5:
                    _a = _b.sent(), date = _a.date, author = _a.author, title = _a.title, link = _a.link;
                    return [4 /*yield*/, page.evaluate(function (elm) {
                            var _a, _b;
                            return (_b = (_a = elm === null || elm === void 0 ? void 0 : elm.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.slice(0, 100);
                        }, bodies[index])];
                case 6:
                    body = _b.sent();
                    posts.push({
                        title: title + "(" + author + ")",
                        summary: body,
                        date: date,
                        link: link,
                    });
                    if (posts.length >= limit) {
                        return [3 /*break*/, 8];
                    }
                    _b.label = 7;
                case 7:
                    index++;
                    return [3 /*break*/, 4];
                case 8: return [4 /*yield*/, page.title()];
                case 9:
                    siteTitle = _b.sent();
                    return [2 /*return*/, { siteTitle: siteTitle, posts: posts }];
            }
        });
    });
};
exports.nogizakaBlog = nogizakaBlog;
var sakurazakaKoshiki = function (page, limit) {
    if (limit === void 0) { limit = defaultLimit; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, newsPath, posts, siteTitle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://sakurazaka46.com";
                    return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.$eval("#page-top > header > div.inner.fxpc > nav > div > ul:nth-child(1) > li:nth-child(3) > a", function (elm) {
                            return elm.getAttribute("href");
                        })];
                case 2:
                    newsPath = _a.sent();
                    if (!newsPath) {
                        return [2 /*return*/, Promise.reject()];
                    }
                    return [4 /*yield*/, page.goto(url + newsPath, { waitUntil: "networkidle2" })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page
                            .$$eval("#cate-news > main > div.col2-wrap.wid1200 > div.col-r > ul > li", function (elements) {
                            return elements.map(function (elm) {
                                var _a, _b, _c;
                                var obj = {};
                                var link = (_a = elm.querySelector("a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href");
                                if (link) {
                                    obj.link = link.startsWith("/")
                                        ? "https://sakurazaka46.com" + link
                                        : link;
                                }
                                var date = (_b = elm.querySelector(".date")) === null || _b === void 0 ? void 0 : _b.textContent;
                                if (date) {
                                    obj.date = new Date(date).getTime();
                                }
                                var title = (_c = elm.querySelector(".lead")) === null || _c === void 0 ? void 0 : _c.textContent;
                                if (title) {
                                    obj.title = title;
                                }
                                return obj;
                            });
                        })
                            .then(function (_posts) { return _posts.slice(0, limit); })];
                case 4:
                    posts = _a.sent();
                    return [4 /*yield*/, page.title()];
                case 5:
                    siteTitle = _a.sent();
                    return [2 /*return*/, { siteTitle: siteTitle, posts: posts }];
            }
        });
    });
};
exports.sakurazakaKoshiki = sakurazakaKoshiki;
var sakurazakaBlog = function (page, limit) {
    if (limit === void 0) { limit = defaultLimit; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, posts, siteTitle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://sakurazaka46.com/s/s46/diary/blog/list";
                    return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page
                            .$$eval("#cate-blog > main > div:nth-child(3) > ul > li", function (elements) {
                            return elements.map(function (elm) {
                                var _a, _b, _c, _d, _e;
                                var post = {};
                                var title = (_a = elm.querySelector(".title")) === null || _a === void 0 ? void 0 : _a.textContent;
                                var author = (_b = elm.querySelector(".name")) === null || _b === void 0 ? void 0 : _b.textContent;
                                if (title && author) {
                                    post.title = title + "(" + author + ")";
                                }
                                var link = (_c = elm.querySelector("a")) === null || _c === void 0 ? void 0 : _c.getAttribute("href");
                                if (link) {
                                    post.link = "https://sakurazaka46.com" + link;
                                }
                                var date = (_d = elm.querySelector(".date")) === null || _d === void 0 ? void 0 : _d.textContent;
                                if (date) {
                                    post.date = new Date(date).getTime();
                                }
                                var summary = (_e = elm.querySelector(".lead")) === null || _e === void 0 ? void 0 : _e.textContent;
                                if (summary) {
                                    post.summary = summary.trim().slice(0, 100);
                                }
                                return post;
                            });
                        })
                            .then(function (_posts) { return _posts.slice(0, limit); })];
                case 2:
                    posts = _a.sent();
                    return [4 /*yield*/, page.title()];
                case 3:
                    siteTitle = _a.sent();
                    return [2 /*return*/, { siteTitle: siteTitle, posts: posts }];
            }
        });
    });
};
exports.sakurazakaBlog = sakurazakaBlog;
var hinatazakaKoshiki = function (page, limit) {
    if (limit === void 0) { limit = defaultLimit; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, newsPath, posts, siteTitle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://www.hinatazaka46.com";
                    return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.$eval("body > div > div.l-header > div > header > nav > ul > li:nth-child(1) > a", function (elm) {
                            return elm.getAttribute("href");
                        })];
                case 2:
                    newsPath = _a.sent();
                    if (!newsPath) {
                        return [2 /*return*/, Promise.reject()];
                    }
                    return [4 /*yield*/, page.goto(url + newsPath, { waitUntil: "networkidle2" })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page
                            .$$eval("body > div > main > section > div > div.l-contents > div.l-maincontents--news > ul > li", function (elements) {
                            return elements.map(function (elm) {
                                var _a, _b, _c;
                                var obj = {};
                                var link = (_a = elm.querySelector("a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href");
                                if (link) {
                                    obj.link = link.startsWith("/")
                                        ? "https://www.hinatazaka46.com" + link
                                        : link;
                                }
                                var date = (_b = elm.querySelector(".c-news__date")) === null || _b === void 0 ? void 0 : _b.textContent;
                                if (date) {
                                    obj.date = new Date(date).getTime();
                                }
                                var title = (((_c = elm.querySelector(".c-news__text")) === null || _c === void 0 ? void 0 : _c.textContent) || "")
                                    .split("\n")
                                    .reduce(function (p, c) {
                                    c = c.trim();
                                    if (c) {
                                        p += c;
                                    }
                                    return p;
                                }, "");
                                if (title) {
                                    obj.title = title;
                                }
                                return obj;
                            });
                        })
                            .then(function (_posts) { return _posts.slice(0, limit); })];
                case 4:
                    posts = _a.sent();
                    return [4 /*yield*/, page.title()];
                case 5:
                    siteTitle = _a.sent();
                    return [2 /*return*/, { siteTitle: siteTitle, posts: posts }];
            }
        });
    });
};
exports.hinatazakaKoshiki = hinatazakaKoshiki;
var hinatazakaBlog = function (page, limit) {
    if (limit === void 0) { limit = defaultLimit; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, posts, siteTitle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://www.hinatazaka46.com/s/official/diary/member";
                    return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page
                            .$$eval("body > div > main > section > div > div.l-contents > div.l-maincontents.l-maincontents--100 > div.p-blog-top__contents > ul > li", function (elements) {
                            return elements.map(function (elm) {
                                var _a, _b, _c, _d, _e, _f;
                                var post = {};
                                var title = (_b = (_a = elm
                                    .querySelector(".c-blog-top__title")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                                var author = (_d = (_c = elm
                                    .querySelector(".c-blog-top__name")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim();
                                if (title && author) {
                                    post.title = title + "(" + author + ")";
                                }
                                var link = (_e = elm.querySelector("a")) === null || _e === void 0 ? void 0 : _e.getAttribute("href");
                                if (link) {
                                    post.link = "https://www.hinatazaka46.com" + link;
                                }
                                var date = (_f = elm.querySelector(".c-blog-top__date")) === null || _f === void 0 ? void 0 : _f.textContent;
                                if (date) {
                                    post.date = new Date(date).getTime();
                                }
                                return post;
                            });
                        })
                            .then(function (_posts) { return _posts.slice(0, limit); })];
                case 2:
                    posts = _a.sent();
                    return [4 /*yield*/, page.title()];
                case 3:
                    siteTitle = _a.sent();
                    return [2 /*return*/, { siteTitle: siteTitle, posts: posts }];
            }
        });
    });
};
exports.hinatazakaBlog = hinatazakaBlog;
