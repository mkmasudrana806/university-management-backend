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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semester = void 0;
const mongoose_1 = require("mongoose");
const semester_constant_1 = require("./semester.constant");
const appError_1 = __importDefault(require("../../utils/appError"));
const http_status_1 = __importDefault(require("http-status"));
// semester schema
const SemesterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        enum: semester_constant_1.SemesterName,
    },
    code: {
        type: String,
        required: true,
        enum: semester_constant_1.SemesterCode,
    },
    year: {
        type: String,
        required: true,
    },
    startMonth: {
        type: String,
        enum: semester_constant_1.Months,
    },
    endMonth: {
        type: String,
        enum: semester_constant_1.Months,
    },
}, {
    timestamps: true,
});
// isSemesterExists statics
SemesterSchema.statics.isSemesterExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.Semester.findById(id);
        return result;
    });
};
// pre hook triggered before create new semester
// check same name semester and year already exists in schema or not
SemesterSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isSemesterExist = yield exports.Semester.findOne({
            name: this.name,
            year: this.year,
        });
        if (isSemesterExist) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Semester is already exists!");
        }
        next();
    });
});
exports.Semester = (0, mongoose_1.model)("Semester", SemesterSchema);
