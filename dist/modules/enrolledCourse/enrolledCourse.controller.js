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
exports.enrolledCourseControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const enrolledCourse_service_1 = require("./enrolledCourse.service");
// -------------------- create an enrolled course --------------------
const createEnrolledCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield enrolledCourse_service_1.enrolledCourseServices.createEnrolledCourseIntoDB(userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Course is enrolled successfully",
        data: result,
    });
}));
// -------------------- update enrolled course marks --------------------
const updateEnrolledCourseMarks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield enrolledCourse_service_1.enrolledCourseServices.updateEnrolledCourseMarksIntoDB(userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Marks is update successfully",
        data: result,
    });
}));
// -------------------- update enrolled course marks --------------------
const getMyEnrolledCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield enrolledCourse_service_1.enrolledCourseServices.getMyEnrolledCoursesFromDB(userId, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "My enrolled courses are retrieved successfully",
        data: result,
    });
}));
exports.enrolledCourseControllers = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
    getMyEnrolledCourses,
};
