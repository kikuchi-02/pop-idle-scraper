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
exports.getMemberTable = exports.getMembers = exports.extractExternalLinks = void 0;
var axios_1 = __importDefault(require("axios"));
var libxmljs2_1 = require("libxmljs2");
var parseTable = function (membersTable) {
    var members = [];
    membersTable
        .childNodes()
        .filter(function (node) { return node.name() === 'tr'; })
        .forEach(function (node) {
        node
            .childNodes()
            .filter(function (td) { return td.name() === 'td'; })
            .slice(0, 1)
            .forEach(function (td) {
            var _a;
            var anchor = td.child(0);
            var name = td.text();
            if (anchor.name() === 'a') {
                var href = (_a = anchor.attr('href')) === null || _a === void 0 ? void 0 : _a.value();
                if (href) {
                    members.push([name, href]);
                    return;
                }
            }
            members.push([name]);
        });
    });
    return members;
};
var formatTable = function (element) {
    element.childNodes().forEach(function (node) {
        if (node.type() === 'element') {
            if (node.name() === 'a') {
                node.attr('target', '_blank');
            }
            var style = node.attr('style');
            if (style && /display:none/.test(style.value())) {
                node.remove();
            }
            if (node) {
                node = formatTable(node);
            }
        }
    });
    return element;
};
var extractMembers = function (htmlString) {
    var members = [];
    var html = libxmljs2_1.parseHtml(htmlString);
    var membersTable = html.get('//*[@id="mw-content-text"]/div[1]/table[2]/tbody');
    if ((membersTable === null || membersTable === void 0 ? void 0 : membersTable.type()) === 'element') {
        members.push.apply(members, parseTable(membersTable));
    }
    var oldMembersTable = html.get('//*[@id="mw-content-text"]/div[1]/table[3]/tbody');
    if ((oldMembersTable === null || oldMembersTable === void 0 ? void 0 : oldMembersTable.type()) === 'element') {
        members.push.apply(members, parseTable(oldMembersTable));
    }
    return members;
};
var extractExternalLinks = function (htmlString) {
    var links = [];
    var html = libxmljs2_1.parseHtml(htmlString);
    var h2 = html.get('//*[@id="外部リンク"]');
    // console.log(h2?.parent().toString())
    // console.log((h2?.parent() as Element).nextSibling()?.toString())
    var sibling = (h2 === null || h2 === void 0 ? void 0 : h2.parent()).nextSibling();
    while (true) {
        if (sibling.name() === 'ul') {
            break;
        }
        sibling = (sibling === null || sibling === void 0 ? void 0 : sibling.nextSibling()) || null;
    }
    if (sibling) {
        sibling
            .childNodes()
            .filter(function (li) { return li.type() === 'element'; })
            .forEach(function (li) {
            li
                .childNodes()
                .filter(function (a) { return a.name() === 'a'; })
                .slice(0, 1)
                .forEach(function (a) {
                var _a;
                var href = (_a = a.attr('href')) === null || _a === void 0 ? void 0 : _a.value();
                if (href) {
                    links.push(href);
                }
            });
        });
    }
    return links;
};
exports.extractExternalLinks = extractExternalLinks;
var switchLink = function (idle) {
    switch (idle) {
        case 'nogizaka':
            return '/wiki/%E4%B9%83%E6%9C%A8%E5%9D%8246#%E3%83%A1%E3%83%B3%E3%83%90%E3%83%BC';
            break;
        case 'sakurazaka':
            return '/wiki/%E6%AB%BB%E5%9D%8246';
            break;
        case 'hinatazaka':
            return '/wiki/%E6%97%A5%E5%90%91%E5%9D%8246';
            break;
        default:
            throw Error("not impletemnetd type " + idle);
    }
};
var getMembers = function (idle) { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, url, homeResponse, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                baseUrl = 'https://ja.wikipedia.org';
                url = baseUrl + switchLink(idle);
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                homeResponse = _a.sent();
                if (homeResponse.status !== 200) {
                    return [2 /*return*/, Promise.reject(Error("status " + homeResponse.status))];
                }
                members = extractMembers(homeResponse.data).map(function (member) {
                    return {
                        name: member[0],
                        link: member[1] ? baseUrl + member[1] : undefined,
                    };
                });
                return [2 /*return*/, members];
        }
    });
}); };
exports.getMembers = getMembers;
var getMemberTable = function (idle) { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, url, homeResponse, urlReplacer, tables, html, membersTable, oldMembersTable;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                baseUrl = 'https://ja.wikipedia.org';
                url = baseUrl + switchLink(idle);
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                homeResponse = _a.sent();
                if (homeResponse.status !== 200) {
                    return [2 /*return*/, Promise.reject(Error("status " + homeResponse.status))];
                }
                urlReplacer = function (match, p) {
                    return match.replace(p, baseUrl + p);
                };
                tables = [];
                html = libxmljs2_1.parseHtml(homeResponse.data);
                membersTable = html.get('//*[@id="mw-content-text"]/div[1]/table[2]');
                if ((membersTable === null || membersTable === void 0 ? void 0 : membersTable.type()) === 'element') {
                    tables.push(formatTable(membersTable)
                        .toString()
                        .replace(/href="(.[^"]*)/g, urlReplacer));
                }
                oldMembersTable = html.get('//*[@id="mw-content-text"]/div[1]/table[3]');
                if ((oldMembersTable === null || oldMembersTable === void 0 ? void 0 : oldMembersTable.type()) === 'element') {
                    tables.push(formatTable(oldMembersTable)
                        .toString()
                        .replace(/href="(.[^"]*)/g, urlReplacer));
                }
                return [2 /*return*/, tables];
        }
    });
}); };
exports.getMemberTable = getMemberTable;
