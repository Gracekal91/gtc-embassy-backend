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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.deleteVisaApplicationById = exports.updateVisaApplicationById = exports.createVisaApplication = exports.getVisaById = exports.getVisaByReference = exports.getVisaApplicationsByPassportNumber = exports.getAllVisaApplications = void 0;
var visa_1 = require("../models/visa");
//to be performed by officials or admins // protected
var getAllVisaApplications = function () { return visa_1.VisaModel.find(); };
exports.getAllVisaApplications = getAllVisaApplications;
var getVisaApplicationsByPassportNumber = function (travel_document_number) { return __awaiter(void 0, void 0, void 0, function () {
    var visaApplications, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, visa_1.VisaModel.find({ travel_document_number: travel_document_number }).exec()];
            case 1:
                visaApplications = _a.sent();
                if (visaApplications.length > 0) {
                    // Visa applications found
                    console.log('Visa applications:', visaApplications);
                    return [2 /*return*/, visaApplications];
                }
                else {
                    // No visa applications found
                    console.log('No visa applications found');
                    return [2 /*return*/, []];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log('Error:', error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getVisaApplicationsByPassportNumber = getVisaApplicationsByPassportNumber;
var getVisaByReference = function (reference) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, visa_1.VisaModel.findOne({ reference: reference }).exec()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.getVisaByReference = getVisaByReference;
var getVisaById = function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, visa_1.VisaModel.findById(id)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.getVisaById = getVisaById;
//Applicant can edit their application - create an application
var createVisaApplication = function (values) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, new visa_1.VisaModel(values).save().then(function (visa) { return visa.toObject(); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.createVisaApplication = createVisaApplication;
var updateVisaApplicationById = function (id, values) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, visa_1.VisaModel.findByIdAndUpdate(id, values)];
}); }); };
exports.updateVisaApplicationById = updateVisaApplicationById;
// Officials can read applications - get application by Passport - update the state of the application
//Admin can do all + delete application
var deleteVisaApplicationById = function (id) { return visa_1.VisaModel.findOneAndDelete({ _id: id }); };
exports.deleteVisaApplicationById = deleteVisaApplicationById;
var updateStatus = function (id, value) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, visa_1.VisaModel.findByIdAndUpdate(id, value)];
}); }); };
exports.updateStatus = updateStatus;
