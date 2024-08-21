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
exports.academicDepartmentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const academicDepartment_service_1 = require("./academicDepartment.service");
const appError_1 = __importDefault(require("../../utils/appError"));
// create a new academic Department
const createAcademicDepartment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicDepartment_service_1.academicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Academic department successfully created!",
        data: result,
    });
}));
// get single academic Department
const getSingleAcademicDepartment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId } = req.params;
    const result = yield academicDepartment_service_1.academicDepartmentServices.getSingleAcademicDepartmentFromDB(departmentId);
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Couldn't found any department");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Academic Department is retrieved successfully",
        data: result,
    });
}));
// get all academic Department
const getAllAcademicDepartment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicDepartment_service_1.academicDepartmentServices.getAllAcademicDepartmentFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Academic departments are retrieved successfully",
        data: result,
    });
}));
// update academic Department
const updateAcademicDepartment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId } = req.params;
    const result = yield academicDepartment_service_1.academicDepartmentServices.updateAcademicDepartmentIntoDB(departmentId, req.body);
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "No department is found in the database");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Academic Department updated successfully",
        data: result,
    });
}));
exports.academicDepartmentControllers = {
    createAcademicDepartment,
    getSingleAcademicDepartment,
    getAllAcademicDepartment,
    updateAcademicDepartment,
};
