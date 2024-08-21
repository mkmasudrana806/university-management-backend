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
exports.studentControllers = void 0;
const student_service_1 = require("./student.service");
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
// -------------------- get all students --------------------
const getAllStudents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_service_1.studentServices.getAllStudentsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Student are retrieved successfully",
        data: result,
    });
}));
// -------------------- get a single student --------------------
const getAStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield student_service_1.studentServices.getAStudentFromDB((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Student not found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Student is retrived successfully",
        data: result,
    });
}));
// -------------------- delete a single student --------------------
const deleteAStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    const result = yield student_service_1.studentServices.deleteAStudentFromDB(studentId);
    if (!result)
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "user and student is not deleted successfully");
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Student is deleted successfully",
        data: result,
    });
}));
// -------------------- update a single student --------------------
const updateAStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    const { student } = req.body;
    const result = yield student_service_1.studentServices.updateAStudentFromDB(studentId, student);
    if (!result)
        throw new appError_1.default(http_status_1.default.NOT_FOUND, " student is not found");
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Student is updated successfully",
        data: result,
    });
}));
exports.studentControllers = {
    getAllStudents,
    getAStudent,
    deleteAStudent,
    updateAStudent,
};
