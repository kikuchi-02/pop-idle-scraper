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
exports.getMemberLinks = exports.hinatazakaBlogLinks = exports.sakurazakaBlogLinks = exports.nogizakaBlogLinks = void 0;
var nogizakaBlogLinks = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var url, baseUrl, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'https://blog.nogizaka46.com';
                return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle0' })];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () {
                        return window.location.origin;
                    })];
            case 2:
                baseUrl = _a.sent();
                return [4 /*yield*/, page.$$('#sidemember > div.clearfix > div.unit')];
            case 3:
                members = _a.sent();
                return [2 /*return*/, Promise.all(members.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, page
                                    .evaluate(function (elm) {
                                    var name = elm.querySelector('.kanji').textContent;
                                    var link = elm.querySelector('a').getAttribute('href');
                                    if (link.startsWith('./')) {
                                        link = link.slice(1);
                                    }
                                    return { name: name, link: link };
                                }, member)
                                    .then(function (m) {
                                    m.link = baseUrl + m.link;
                                    return m;
                                })];
                        });
                    }); }))];
        }
    });
}); };
exports.nogizakaBlogLinks = nogizakaBlogLinks;
var sakurazakaBlogLinks = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var url, baseUrl, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'https://sakurazaka46.com/s/s46/diary/blog/list';
                return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle0' })];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () {
                        return window.location.origin;
                    })];
            case 2:
                baseUrl = _a.sent();
                return [4 /*yield*/, page.$$('#cate-blog > main > div:nth-child(3) > div.btn-wrap > div > div > div > form > select > option')];
            case 3:
                members = _a.sent();
                return [2 /*return*/, Promise.all(members.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, page.evaluate(function (elm) {
                                    var name = elm.textContent;
                                    var link = elm.getAttribute('value');
                                    if (link.startsWith('./')) {
                                        link = link.slice(1);
                                    }
                                    return { name: name, link: link };
                                }, member)];
                        });
                    }); })).then(function (_members) {
                        return _members
                            .filter(function (m) { return m.name && m.link; })
                            .map(function (m) {
                            m.name = m.name.slice(0, m.name.indexOf('('));
                            m.link = baseUrl + m.link;
                            return m;
                        });
                    })];
        }
    });
}); };
exports.sakurazakaBlogLinks = sakurazakaBlogLinks;
var hinatazakaBlogLinks = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var url, baseUrl, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'https://www.hinatazaka46.com/s/official/diary/member/list';
                return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle0' })];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () {
                        return window.location.origin;
                    })];
            case 2:
                baseUrl = _a.sent();
                return [4 /*yield*/, page.$$('body > div > main > section > div > div.l-contents.l-contents--blog-list > div.l-sub-contents--blog > div > div.p-blog-member-filter > div > form > select > option')];
            case 3:
                members = _a.sent();
                return [2 /*return*/, Promise.all(members.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, page.evaluate(function (elm) {
                                    var name = elm.textContent;
                                    var link = elm.getAttribute('value');
                                    if (link.startsWith('./')) {
                                        link = link.slice(1);
                                    }
                                    return { name: name, link: link };
                                }, member)];
                        });
                    }); })).then(function (_members) {
                        return _members
                            .filter(function (m) { return m.name && m.link; })
                            .map(function (m) {
                            m.name = m.name.slice(0, m.name.indexOf('('));
                            m.link = baseUrl + m.link;
                            return m;
                        });
                    })];
        }
    });
}); };
exports.hinatazakaBlogLinks = hinatazakaBlogLinks;
var getMemberLinks = function (page, kind) {
    switch (kind) {
        case 'nogizaka':
            return exports.nogizakaBlogLinks(page);
        case 'hinatazaka':
            return exports.hinatazakaBlogLinks(page);
        case 'sakurazaka':
            return exports.sakurazakaBlogLinks(page);
        default:
            throw Error('not valid kind');
    }
};
exports.getMemberLinks = getMemberLinks;
