'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 00:30:10
 * @LastEditTime : 2022-01-15 00:36:18
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \MintForge\packages\mintin-util\lib\common\index.ts
 * @Description  : 通用工具函数
 */
/**
 * 将 ArrayBuffer 转换为 base64 字符串
 * @param arr ArrayBuffer
 * @returns base64str
 */
function arrayBufferToBase64(arr) {
    var array = new Uint8Array(arr);
    var length = array.byteLength;
    var table = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'];
    var base64Str = '';
    for (var i = 0; length - i >= 3; i += 3) {
        var num1 = array[i];
        var num2 = array[i + 1];
        var num3 = array[i + 2];
        base64Str += table[num1 >>> 2]
            + table[((num1 & 3) << 4) | (num2 >>> 4)]
            + table[((num2 & 15) << 2) | (num3 >>> 6)]
            + table[num3 & 63];
    }
    var lastByte = length - i;
    if (lastByte === 1) {
        var lastNum1 = array[i];
        base64Str += table[lastNum1 >>> 2] + table[((lastNum1 & 3) << 4)] + '==';
    }
    else if (lastByte === 2) {
        var lastNum1 = array[i];
        var lastNum2 = array[i + 1];
        base64Str += table[lastNum1 >>> 2]
            + table[((lastNum1 & 3) << 4) | (lastNum2 >>> 4)]
            + table[(lastNum2 & 15) << 2]
            + '=';
    }
    return base64Str;
}
/**
 * 返回给定范围内的随机整数
 * @param min 区间最小值
 * @param max 区间最大值
 * @returns 随机整数
 */
function randomInteger(min, max) {
    return parseInt(String(Math.random() * (max - min + 1)), 10);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

function readDirAsync(p, fileList) {
    if (fileList === void 0) { fileList = []; }
    return __awaiter(this, void 0, void 0, function () {
        var files, _i, files_1, f, filePath, stat, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readdirAsync(p)];
                case 1:
                    files = _a.sent();
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 6];
                    f = files_1[_i];
                    filePath = path__default["default"].join(p, f);
                    return [4 /*yield*/, statAsync(filePath)];
                case 3:
                    stat = _a.sent();
                    if (stat.isFile()) {
                        fileList.push(filePath);
                    }
                    if (!stat.isDirectory()) return [3 /*break*/, 5];
                    return [4 /*yield*/, readDirAsync(filePath, fileList)];
                case 4:
                    r = _a.sent();
                    r.forEach(function (e) { return fileList.push(e); });
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/, fileList];
            }
        });
    });
}
function readdirAsync(p, opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs__default["default"].readdir(p, __assign({}, opts), function (err, files) {
                        if (err)
                            reject(err);
                        else
                            resolve(files);
                    });
                })];
        });
    });
}
function readFileAsync(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs__default["default"].readFile(p, function (err, data) {
                        if (err)
                            reject(err);
                        else
                            resolve(data);
                    });
                })];
        });
    });
}
function writeFileAsync(p, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs__default["default"].writeFile(p, data, function (err) {
                        if (err)
                            reject(err);
                        else
                            resolve(true);
                    });
                })];
        });
    });
}
function statAsync(p, opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs__default["default"].stat(p, function (err, stats) {
                        if (err)
                            reject(err);
                        else
                            resolve(stats);
                    });
                })];
        });
    });
}

/**
 * test the string is email or not
 * @param s email string be validated
 * @param opts allowDot: if allow . in the name
 * @returns boolean
 */
function isEmail(s, opts) {
    var pattern;
    var allowDot;
    if (opts) {
        allowDot = opts.allowDot;
    }
    else {
        allowDot = true;
    }
    if (allowDot) {
        pattern = /^[\.A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i;
    }
    else {
        pattern = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i;
    }
    return pattern.test(s);
}

function isID(s, locale) {
    var loc = locale || 'cn';
    switch (loc) {
        case 'cn':
            return checkCode(s) && checkProvince(s.substring(0, 2)) && checkBirthday(s.substring(6, 14));
    }
}
function checkProvince(s) {
    var pattern = /^[1-9][0-9]/;
    var provs = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "中国台湾",
        81: "中国香港",
        82: "中国澳门"
    };
    return Boolean(pattern.test(String(s)) && provs[Number(s)]);
}
function checkBirthday(s) {
    var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
    if (pattern.test(s)) {
        var year = s.substring(0, 4);
        var month = s.substring(4, 6);
        var day = s.substring(6, 8);
        var date = new Date(year + '-' + month + '-' + day);
        return date && date.getMonth() === (parseInt(month) - 1);
    }
    else {
        return false;
    }
}
function checkCode(s) {
    var pattern = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    var code = s.substring(17);
    if (pattern.test(s)) {
        var sum = 0;
        for (var i = 0; i < 17; i++) {
            sum += Number(s[i]) * factor[i];
        }
        return String(parity[sum % 11]) === code.toUpperCase();
    }
    else {
        return false;
    }
}

function isUUID(s, version) {
    var v = version || 4;
    var patterns = {
        1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
        4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    };
    return patterns[v].test(s);
}

exports.arrayBufferToBase64 = arrayBufferToBase64;
exports.isEmail = isEmail;
exports.isID = isID;
exports.isUUID = isUUID;
exports.randomInteger = randomInteger;
exports.readDirAsync = readDirAsync;
exports.readFileAsync = readFileAsync;
exports.readdirAsync = readdirAsync;
exports.statAsync = statAsync;
exports.writeFileAsync = writeFileAsync;
