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
exports.offeredCourseControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const offeredCourse_service_1 = require("./offeredCourse.service");
// ---------- create a new Semester registration ----------
const createofferedCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // save data to database
    const result = yield offeredCourse_service_1.offeredCourseServices.createofferedCourseIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Semester registration is created successfully",
        data: result,
    });
}));
// ---------- get all semester registration ----------
const getAllSemestersRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get all semester registration from database
    const result = yield offeredCourse_service_1.offeredCourseServices.getAllofferedCourseFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All semesters Registrations are retrived successfully",
        data: result,
    });
}));
// ---------- get single semester registration ----------
const getofferedCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offeredCourse_service_1.offeredCourseServices.getofferedCourseFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "semester registration is retrieved successfully",
        data: result,
    });
}));
// ---------- update single semester registration ----------
const updateofferedCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield offeredCourse_service_1.offeredCourseServices.updateofferedCourseFromDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "semester registration updated successfully",
        data: result,
    });
}));
exports.offeredCourseControllers = {
    createofferedCourse,
    getAllSemestersRegistration,
    getofferedCourse,
    updateofferedCourse,
};
