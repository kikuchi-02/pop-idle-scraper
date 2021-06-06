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
exports.getBlogLinks2 = exports.getBlogLinks = void 0;
var axios_1 = __importDefault(require("axios"));
var libxmljs2_1 = require("libxmljs2");
var getBaseUrl = function (url) {
    var u = new URL(url);
    return u.protocol + '//' + u.host;
};
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
var nogizakaBlogLinks2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, response, htmlString, html, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'https://blog.nogizaka46.com';
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _a.sent();
                htmlString = response.data;
                html = libxmljs2_1.parseHtml(htmlString);
                members = html.get('//*[@id="sidemember"]/div[@class="clearfix"]');
                return [2 /*return*/, members
                        .childNodes()
                        .filter(function (node) { return node.type() === 'element' && node.name() === 'div'; })
                        .map(function (node) {
                        var _a;
                        var _name = node.get('*/span[@class="kanji"]');
                        var name = _name.text();
                        var anchor = node.get('a');
                        var link = (_a = anchor.attr('href')) === null || _a === void 0 ? void 0 : _a.value();
                        if (link === null || link === void 0 ? void 0 : link.startsWith('./')) {
                            link = url + link.slice(1);
                        }
                        return { name: name, link: link };
                    })];
        }
    });
}); };
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
var sakurazakaBlogLinks2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, response, htmlString, html, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'https://sakurazaka46.com/s/s46/diary/blog/list';
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _a.sent();
                htmlString = response.data;
                html = libxmljs2_1.parseHtml(htmlString);
                members = html.get('//select');
                return [2 /*return*/, members
                        .childNodes()
                        .filter(function (node) {
                        var _a;
                        return node.type() === 'element' &&
                            node.name() === 'option' &&
                            ((_a = node.attr('value')) === null || _a === void 0 ? void 0 : _a.value());
                    })
                        .map(function (node) {
                        var _a;
                        var name = node.text();
                        name = name.slice(0, name.indexOf('('));
                        var link = (_a = node.attr('value')) === null || _a === void 0 ? void 0 : _a.value();
                        if (link === null || link === void 0 ? void 0 : link.startsWith('/')) {
                            link = getBaseUrl(url) + link;
                        }
                        return { name: name, link: link };
                    })];
        }
    });
}); };
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
var hinatazakaBlogLinks2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, response, htmlString, html, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'https://www.hinatazaka46.com/s/official/diary/member/list';
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _a.sent();
                htmlString = response.data;
                html = libxmljs2_1.parseHtml(htmlString);
                members = html.get('//select');
                return [2 /*return*/, members
                        .childNodes()
                        .filter(function (node) {
                        var _a;
                        return node.type() === 'element' &&
                            node.name() === 'option' &&
                            ((_a = node.attr('value')) === null || _a === void 0 ? void 0 : _a.value());
                    })
                        .map(function (node) {
                        var _a;
                        var name = node.text();
                        name = name.slice(0, name.indexOf('('));
                        var link = (_a = node.attr('value')) === null || _a === void 0 ? void 0 : _a.value();
                        if (link === null || link === void 0 ? void 0 : link.startsWith('/')) {
                            link = getBaseUrl(url) + link;
                        }
                        return { name: name, link: link };
                    })];
        }
    });
}); };
var getBlogLinks = function (page, kind) {
    switch (kind) {
        case 'nogizaka':
            return nogizakaBlogLinks(page);
        case 'hinatazaka':
            return hinatazakaBlogLinks(page);
        case 'sakurazaka':
            return sakurazakaBlogLinks(page);
        default:
            throw Error('not valid kind');
    }
};
exports.getBlogLinks = getBlogLinks;
var getBlogLinks2 = function (kind) {
    switch (kind) {
        case 'nogizaka':
            return nogizakaBlogLinks2();
        case 'hinatazaka':
            return hinatazakaBlogLinks2();
        case 'sakurazaka':
            return sakurazakaBlogLinks2();
        default:
            throw Error('not valid kind');
    }
};
exports.getBlogLinks2 = getBlogLinks2;
