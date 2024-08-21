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
exports.SemesterServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../utils/appError"));
const semester_constant_1 = require("./semester.constant");
const semester_model_1 = require("./semester.model");
// create a new Semester service
const createSemesterIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check semester name - code pair correctness
    if (semester_constant_1.SemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Invalid semester name and code");
    }
    const result = yield semester_model_1.Semester.create(payload);
    return result;
});
// get all semesters service
const getAllSemesterFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield semester_model_1.Semester.find({});
    return result;
});
// get a semester
const getSingleSemesterFromDB = (semesterId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield semester_model_1.Semester.findById(semesterId);
    return result;
});
// update a semester
const updateSingleSemesterFromDB = (semesterId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.name &&
        payload.code &&
        semester_constant_1.SemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Invalid Semester Code");
    }
    const result = yield semester_model_1.Semester.findOneAndUpdate({ _id: semesterId }, payload, {
        new: true,
    });
    return result;
});
exports.SemesterServices = {
    createSemesterIntoDB,
    getAllSemesterFromDB,
    getSingleSemesterFromDB,
    updateSingleSemesterFromDB,
};
