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
exports.offeredCourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../utils/appError"));
const semester_model_1 = require("../academicSemester/semester.model");
const offeredCourse_model_1 = require("./offeredCourse.model");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const offeredCourse_constants_1 = require("./offeredCourse.constants");
// ---------- create a new Semester Registration service ----------
const createofferedCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if there any registered semester that is already 'UPCOMMING' or 'ONGOING'
    const currentofferedCourseStatus = yield offeredCourse_model_1.offeredCourse.findOne({
        $or: [{ status: "UPCOMMING" }, { status: "ONGOING" }],
    });
    if (currentofferedCourseStatus) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, `already there is a ${currentofferedCourseStatus.status} registered semester`);
    }
    // check if academic semester is exist
    if (!(yield semester_model_1.Semester.isSemesterExists(String(payload.academicSemester)))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Academic semester not found");
    }
    // check if semester registration already exists
    const res = yield offeredCourse_model_1.offeredCourse.isofferedCourseExists(payload.academicSemester);
    if (res) {
        throw new appError_1.default(http_status_1.default.CONFLICT, "semester registration already exists");
    }
    // don't create new semester registration, if
    // create new semester registration
    const result = yield offeredCourse_model_1.offeredCourse.create(payload);
    return result;
});
// ---------- get all semesters registrations service ----------
const getAllofferedCourseFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const offeredCourseQuery = new QueryBuilder_1.default(offeredCourse_model_1.offeredCourse.find().populate("academicSemester"), query)
        .filter()
        .sort()
        .paginate()
        .fieldsLimiting();
    const result = yield offeredCourseQuery.modelQuery;
    return result;
});
// ---------- get a semester registration ----------
const getofferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offeredCourse_model_1.offeredCourse.findById(id);
    return result;
});
// ---------- update a semester registration ----------
const updateofferedCourseFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if semester registration exists
    const isofferedCourseExists = yield offeredCourse_model_1.offeredCourse.findById(id);
    if (!isofferedCourseExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "this semester registration is not found !");
    }
    const currentSemesterStatus = isofferedCourseExists.status;
    // check if semester registration is already 'ENDED', we will not update
    if (currentSemesterStatus === offeredCourse_constants_1.registrationStatus.ENDED) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "this semester registration already ENDED");
    }
    // upcomming ----- ongoing ------- ended. possible status changes
    if (payload === null || payload === void 0 ? void 0 : payload.status) {
        if ((currentSemesterStatus === offeredCourse_constants_1.registrationStatus.UPCOMING &&
            payload.status === offeredCourse_constants_1.registrationStatus.ONGOING) ||
            (currentSemesterStatus === offeredCourse_constants_1.registrationStatus.ONGOING &&
                payload.status === offeredCourse_constants_1.registrationStatus.ENDED)) {
            const result = yield offeredCourse_model_1.offeredCourse.findByIdAndUpdate(id, payload, {
                new: true,
            });
            return result;
        }
        else {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, `you can not change status directly ${currentSemesterStatus} to ${payload === null || payload === void 0 ? void 0 : payload.status}`);
        }
    }
    else {
        const result = yield offeredCourse_model_1.offeredCourse.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result;
    }
});
exports.offeredCourseServices = {
    createofferedCourseIntoDB,
    getAllofferedCourseFromDB,
    getofferedCourseFromDB,
    updateofferedCourseFromDB,
};
