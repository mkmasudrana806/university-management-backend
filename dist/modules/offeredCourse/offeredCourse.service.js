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
const offeredCourse_model_1 = require("./offeredCourse.model");
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const semester_model_1 = require("../academicSemester/semester.model");
const academicFaculty_model_1 = require("../academicFaculty/academicFaculty.model");
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
const course_model_1 = require("../courses/course.model");
const faculty_model_1 = __importDefault(require("../faculty/faculty.model"));
const offeredCourse_utils_1 = require("./offeredCourse.utils");
// ---------- create a new orffered course ----------
const createOfferedCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime, } = payload;
    // check if semester registration exists
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "No semester registration found");
    }
    // check if academic semester exists
    const isSemesterExists = yield semester_model_1.Semester.findById(isSemesterRegistrationExists.academicSemester);
    if (!isSemesterExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Academic semester is not found");
    }
    payload.academicSemester = isSemesterRegistrationExists.academicSemester;
    // check if academic faculty is exists
    const isAcademicFacultyExists = yield academicFaculty_model_1.AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Academic faculty is not found");
    }
    // check if academic department is exists
    const isAcademicDepartmentExists = yield academicDepartment_model_1.AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Academic department is not found");
    }
    // check if academic department is belong to academic faculty
    const academicDepartmentId = JSON.stringify(isAcademicDepartmentExists.academicFaculty);
    const academicFacultyId = JSON.stringify(isAcademicFacultyExists._id);
    if (academicDepartmentId !== academicFacultyId) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, `this Department of ${isAcademicDepartmentExists.name} is not belong to ${isAcademicFacultyExists.name}`);
    }
    // check if course is exists
    if (!(yield course_model_1.Course.findById(course))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Course is not found");
    }
    // check if faculty is exists
    if (!(yield faculty_model_1.default.findById(faculty))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Faculty is not found");
    }
    // check if the same offered course exist in same section and same registered semester
    const isExistsSameOfferedCourse = yield offeredCourse_model_1.OfferedCourse.findOne({
        semesterRegistration,
        course,
        section,
    });
    if (isExistsSameOfferedCourse) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Same section is already exists!, Same course with same registered semester is not possible to offer same section");
    }
    // check if the new faculty already take a course with the same time
    // retrived offered courses for this new faculty with same registered section
    const assignedSchedule = yield offeredCourse_model_1.OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select("days startTime endTime");
    const newSchedule = { days, startTime, endTime };
    if ((0, offeredCourse_utils_1.hasTimeConflict)(assignedSchedule, newSchedule)) {
        throw new appError_1.default(http_status_1.default.CONFLICT, `This faculty is not available at ${startTime} - ${endTime} on ${days}, choose other time or day`);
    }
    const result = yield offeredCourse_model_1.OfferedCourse.create(payload);
    return result;
});
// ---------- get all offered coruses ----------
const getAllOfferedCoursesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offeredCourse_model_1.OfferedCourse.find({});
    return result;
});
// ---------- get an offered course ----------
const getOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offeredCourse_model_1.OfferedCourse.findById(id);
    return result;
});
// ---------- delete an offered course ----------
const deleteOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if offered course exists
    const isOfferedCourseExists = yield offeredCourse_model_1.OfferedCourse.isOfferedCourseExists(id);
    if (!isOfferedCourseExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Offered course is not found!");
    }
    // delete offered course, only if semester registration status is 'UPCOMING'
    const semesterRegistration = yield semesterRegistration_model_1.SemesterRegistration.findById(isOfferedCourseExists.semesterRegistration).select("status");
    if ((semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.status) !== "UPCOMING") {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, `You can not delete this offered course, because the semester registration is '${semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.status}'`);
    }
    const result = yield offeredCourse_model_1.OfferedCourse.findByIdAndDelete(id);
    return result;
});
// ---------- update an offered course ----------
const updateOfferedCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { faculty, days, startTime, endTime } = payload;
    // check if offered course exists
    const isOfferedCourseExists = yield offeredCourse_model_1.OfferedCourse.isOfferedCourseExists(id);
    if (!isOfferedCourseExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Offered course is not found!");
    }
    // check if faculty is exists
    if (!(yield faculty_model_1.default.isFacultyExists(String(faculty)))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Faculty is not found!");
    }
    // check if semester registration status 'UPCOMING'. else throw new AppError
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterRegistrationStatus = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if ((semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status) !== "UPCOMING") {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, `you can not update this offered course, as it is already ${semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status}`);
    }
    // check time comflict
    // check if the new faculty already take a course with the same time
    // retrived offered courses for this new faculty with same registered section
    const assignedSchedule = yield offeredCourse_model_1.OfferedCourse.find({
        faculty,
        days: { $in: days },
    }).select("days startTime endTime");
    const newSchedule = { days, startTime, endTime };
    if ((0, offeredCourse_utils_1.hasTimeConflict)(assignedSchedule, newSchedule)) {
        throw new appError_1.default(http_status_1.default.CONFLICT, `This faculty is not available at ${startTime} - ${endTime} on ${days}, choose other time or day`);
    }
    const result = yield offeredCourse_model_1.OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.offeredCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getOfferedCourseFromDB,
    deleteOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
};
