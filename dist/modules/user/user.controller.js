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
exports.UserControllers = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
// RequestHandler: manage type of req, res, next etc
// create a student
const createStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pass data to service
    const { password, student: studentData } = req.body;
    // save data to database
    const result = yield user_service_1.UserServices.createStudentIntoDB(req.file, password, studentData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Student created successfully",
        data: result,
    });
}));
// create a faculty
const createFaculty = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pass data to service
    const { password, faculty: facultyData } = req.body;
    // save data to database
    const result = yield user_service_1.UserServices.createFacultyIntoDB(req.file, password, facultyData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "faculty created successfully",
        data: result,
    });
}));
// create an admin
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pass data to service
    const { password, admin: adminData } = req.body;
    // save data to database
    const result = yield user_service_1.UserServices.createAdminIntoDB(req.file, password, adminData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "admin created successfully",
        data: result,
    });
}));
// -------------------- getMe ---------------------
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    const result = yield user_service_1.UserServices.getMe(userId, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User is retrieved successfully",
        data: result,
    });
}));
// -------------------- changeUserStatus ---------------------
const changeUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.changeUserStatus(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User status is changed successfully",
        data: result,
    });
}));
exports.UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeUserStatus,
};
