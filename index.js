"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.__esModule = true;
var axios_1 = __importDefault(require("axios"));
var cheerio = __importStar(require("cheerio"));
var express_1 = __importDefault(require("express"));
var bodyParser = __importStar(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var getHtml_1 = require("./getHtml");
var node_cache_1 = __importDefault(require("node-cache"));
var app = (0, express_1["default"])();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1["default"])());
var port = process.env.PORT || 8001;
// create a new cache with a default ttl of 5 minutes
var cache = new node_cache_1["default"]({ stdTTL: 300, checkperiod: 180 * 60 });
// define the cache keys for each endpoint
var cacheKeys = {
    cruzeiro: 'cruzeiro_articles',
    deusmedibre: 'deusmedibre_articles',
    geGlobo: 'geGlobo_articles'
};
var cruzeiroArticles = [];
var deusMeDibreArticles = [];
var geGloboArticles = [];
var ID = 0;
// API's home page
app.get("/", function (req, res) {
    res.status(200).send("\n\t\t\t<div>\n\t\t\t  <h1>Cruzeiro Scraper API</h1>\n\t\t\t\t<p>Criado por Dan Costa...</p>\n\t\t\t</div>\n\t\t");
});
// getting articles from Cruzeiro's website
app.get("/cruzeiro", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, cruzeiroUrl, cachedArticles, data, $, articleArray, i, id, element, title, url, thumbnail, date, html, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.query.key;
                cruzeiroUrl = "https://cruzeiro.com.br/noticias/";
                if (!!key) return [3 /*break*/, 1];
                res.status(400).send("\n\t\t\t\t<div>\n\t\t\t\t\t<h4>Please provide API KEY</h4>\n\t\t\t\t</div>\n\t\t\t");
                return [3 /*break*/, 10];
            case 1:
                cachedArticles = cache.get(cacheKeys.cruzeiro);
                if (!cachedArticles) return [3 /*break*/, 2];
                console.log('Returning cached Cruzeiro articles');
                res.status(200).send(cachedArticles);
                return [3 /*break*/, 10];
            case 2:
                _a.trys.push([2, 9, , 10]);
                return [4 /*yield*/, axios_1["default"].get(cruzeiroUrl)];
            case 3:
                data = (_a.sent()).data;
                $ = cheerio.load(data);
                articleArray = $("body > #noticias > .nq-c-BlockBanner2Pushs4Thumbnails > .nq-u-hspace > .container > .row > .col");
                cruzeiroArticles = [];
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < articleArray.length)) return [3 /*break*/, 8];
                id = articleArray[i];
                element = articleArray[i];
                title = $(element).find("h4").text();
                url = $(element).find("figure > a").attr("href");
                thumbnail = $(element).find("figure > img").attr("src");
                date = $(element).find(".date").text();
                html = '';
                if (!url) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, getHtml_1.getHtml)("https://cruzeiro.com.br".concat(url), 'cruzeiro')];
            case 5:
                html = (_a.sent()) || '';
                _a.label = 6;
            case 6:
                cruzeiroArticles.push({
                    id: "".concat('cruzeiro' + ID++, " + ").concat(i),
                    title: title,
                    thumbnail: "https://cruzeiro.com.br".concat(thumbnail),
                    url: "https://cruzeiro.com.br".concat(url),
                    publicado: date,
                    portal: 'Cruzeiro',
                    html: html
                });
                _a.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 4];
            case 8:
                // store the articles in cache
                cache.set(cacheKeys.cruzeiro, cruzeiroArticles);
                console.log("Cached Cruzeiro articles for 3 hours");
                // sending the final array
                res.status(200).send(cruzeiroArticles);
                return [3 /*break*/, 10];
            case 9:
                err_1 = _a.sent();
                console.error('Error on the endpoint /cruzeiro', err_1);
                res.status(500).send('Internal server error');
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// getting cruzeiro's articles by id
app.get('/cruzeiro/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, article, url_id, data, $;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.query.key;
                if (!!key) return [3 /*break*/, 1];
                res.status(400).send("\n\t\t\t\t<div>\n\t\t\t\t\t<h4>Please provide API KEY</h4>\n\t\t\t\t</div>\n\t\t\t");
                return [3 /*break*/, 4];
            case 1:
                article = cruzeiroArticles.find(function (article) { return article.id === parseInt(req.params.id); });
                if (!!article) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(404).send("\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<h1>404</h1>\n\t\t\t\t\t\t<h3>The article with the given id does not exist</h3>\n\t\t\t\t\t</div>\n\t\t\t\t")];
            case 2:
                url_id = article.url;
                if (!url_id) return [3 /*break*/, 4];
                return [4 /*yield*/, axios_1["default"].get(url_id)];
            case 3:
                data = (_a.sent()).data;
                $ = cheerio.load(data);
                return [2 /*return*/, res.status(200).send($("figcaption > div").html())];
            case 4: return [2 /*return*/];
        }
    });
}); });
// getting articles from Deus Me Dibre's website
app.get("/deusmedibre", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, deusMeDibreUrl, cachedArticles, data, $, articleArray, i, id, element, title, url, thumbnail, date, author, html, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.query.key;
                deusMeDibreUrl = "https://deusmedibre.com.br/cruzeiro/";
                if (!!key) return [3 /*break*/, 1];
                res.status(400).send("\n\t\t\t\t<div>\n\t\t\t\t\t<h4>Please provide API KEY</h4>\n\t\t\t\t</div>\n\t\t\t");
                return [3 /*break*/, 10];
            case 1:
                cachedArticles = cache.get(cacheKeys.deusmedibre);
                if (!cachedArticles) return [3 /*break*/, 2];
                console.log('Returning cached DeusMeDibre articles');
                res.status(200).send(cachedArticles);
                return [3 /*break*/, 10];
            case 2:
                _a.trys.push([2, 9, , 10]);
                return [4 /*yield*/, axios_1["default"].get(deusMeDibreUrl)];
            case 3:
                data = (_a.sent()).data;
                $ = cheerio.load(data);
                articleArray = $("#todos-posts > article");
                deusMeDibreArticles = [];
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < articleArray.length)) return [3 /*break*/, 8];
                id = articleArray[i];
                element = articleArray[i];
                title = $(element).find("h2").text();
                url = $(element).find("a").attr("href");
                thumbnail = $(element).find(".thumbnail > a > img").attr("src");
                date = $(element).find(".post-date").text();
                author = $(element).find(".post-author > a").text().replace(/(\n\t\t\t\t\t\t|\t\t\t\t\t)/gm, "");
                html = '';
                if (!url) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, getHtml_1.getHtml)(url, 'deusMeDibre')];
            case 5:
                html = (_a.sent()) || '';
                _a.label = 6;
            case 6:
                // Adding information to the array
                deusMeDibreArticles.push({
                    id: "".concat('deusmedibre_' + ID++, " + ").concat(i),
                    title: title,
                    thumbnail: thumbnail,
                    url: url,
                    publicado: date,
                    author: author,
                    portal: 'Deus Me Dibre',
                    html: html
                });
                _a.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 4];
            case 8:
                // store the articles in cache
                cache.set(cacheKeys.deusmedibre, deusMeDibreArticles);
                console.log("Cached deusMeDibre articles for 10 minutes");
                // sending the final array
                res.status(200).send(deusMeDibreArticles);
                return [3 /*break*/, 10];
            case 9:
                err_2 = _a.sent();
                console.error('Error on the endpoint /deusMeDibre', err_2);
                res.status(500).send({ message: err_2.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// getting deusmedibre's articles by id
app.get('/deusmedibre/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, article, url_id, data, $;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.query.key;
                if (!!key) return [3 /*break*/, 1];
                res.status(400).send("\n\t\t\t\t<div>\n\t\t\t\t\t<h4>Please provide API KEY</h4>\n\t\t\t\t</div>\n\t\t\t");
                return [3 /*break*/, 4];
            case 1:
                article = deusMeDibreArticles.find(function (article) { return article.id === parseInt(req.params.id); });
                if (!!article) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(404).send("\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<h1>404</h1>\n\t\t\t\t\t\t<h3>The article with the given id does not exist</h3>\n\t\t\t\t\t</div>\n\t\t\t\t")];
            case 2:
                url_id = article.url;
                if (!url_id) return [3 /*break*/, 4];
                return [4 /*yield*/, axios_1["default"].get(url_id)];
            case 3:
                data = (_a.sent()).data;
                $ = cheerio.load(data);
                return [2 /*return*/, res.status(200).send($(".conteudo-post").html())];
            case 4: return [2 /*return*/];
        }
    });
}); });
// getting articles from Ge Globo's website
app.get("/geglobo", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, geGloboUrl, cachedArticles, data, $, articleArray, i, id, element, title, url, thumbnail, date, html, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.query.key;
                geGloboUrl = "https://ge.globo.com/futebol/times/cruzeiro/";
                if (!!key) return [3 /*break*/, 1];
                res.status(400).send("\n\t\t\t\t<div>\n\t\t\t\t\t<h4>Please provide API KEY</h4>\n\t\t\t\t</div>\n\t\t\t");
                return [3 /*break*/, 10];
            case 1:
                cachedArticles = cache.get(cacheKeys.geGlobo);
                if (!cachedArticles) return [3 /*break*/, 2];
                console.log('Returning cached GeGlobo articles');
                res.status(200).send(cachedArticles);
                return [3 /*break*/, 10];
            case 2:
                _a.trys.push([2, 9, , 10]);
                return [4 /*yield*/, axios_1["default"].get(geGloboUrl)];
            case 3:
                data = (_a.sent()).data;
                $ = cheerio.load(data);
                articleArray = $(".bastian-page > ._evg > ._evt > .bastian-feed-item");
                // Clear array
                geGloboArticles = [];
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < articleArray.length)) return [3 /*break*/, 8];
                id = articleArray[i];
                element = articleArray[i];
                title = $(element).find("h2 > a").text();
                url = $(element).find("a").attr("href");
                thumbnail = $(element).find(".bstn-fd-picture-image").attr("src");
                date = $(element).find(".feed-post-datetime").text();
                html = '';
                if (!url) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, getHtml_1.getHtml)(url, 'geGlobo')];
            case 5:
                html = (_a.sent()) || '';
                _a.label = 6;
            case 6:
                // Adding information to the array
                geGloboArticles.push({
                    id: "".concat('ge_' + ID++, " + ").concat(i),
                    title: title,
                    thumbnail: thumbnail,
                    url: url,
                    publicado: date,
                    portal: 'Globo',
                    html: html
                });
                _a.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 4];
            case 8:
                // store the articles in cache
                cache.set(cacheKeys.geGlobo, geGloboArticles);
                console.log("Cached Globo GE articles for 10 minutes");
                // sending the final array
                res.status(200).send(geGloboArticles);
                return [3 /*break*/, 10];
            case 9:
                err_3 = _a.sent();
                console.error('Error on the endpoint /geglobo', err_3);
                res.status(500).send({ message: err_3.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// getting Ge Globo's articles by id
app.get('/geglobo/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, article, url_id, data, $;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.query.key;
                if (!!key) return [3 /*break*/, 1];
                res.status(400).send("\n\t\t\t\t<div>\n\t\t\t\t\t<h4 style=\"color:blue;text-align:center;\">Please provide API KEY</h4>\n\t\t\t\t</div>\n\t\t\t");
                return [3 /*break*/, 4];
            case 1:
                article = geGloboArticles.find(function (article) { return article.id === parseInt(req.params.id); });
                if (!!article) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(404).send("\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<h1>404</h1>\n\t\t\t\t\t\t<h3>The article with the given id does not exist</h3>\n\t\t\t\t\t</div>\n\t\t\t\t")];
            case 2:
                url_id = article.url;
                if (!url_id) return [3 /*break*/, 4];
                return [4 /*yield*/, axios_1["default"].get(url_id)];
            case 3:
                data = (_a.sent()).data;
                $ = cheerio.load(data);
                return [2 /*return*/, res.status(200).send($("article").html())];
            case 4: return [2 /*return*/];
        }
    });
}); });
var server = app.listen(port, function () { return console.log("Server is running on ".concat(port, "...")); });
server.timeout = 5000;
//# sourceMappingURL=index.js.map