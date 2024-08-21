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
exports.facultyControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const faculty_services_1 = require("./faculty.services");
// get all faculties
const getAllFaculties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faculty_services_1.facultyServices.getAllFacultiesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "faculties are retrieved successfully",
        data: result,
    });
}));
// get a single faculty
const getAFaculty = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield faculty_services_1.facultyServices.getAFacultyFromDB(id);
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Faculty not found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Faculty is retrived successfully",
        data: result,
    });
}));
// delete a single faculty
const deleteAFaculty = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield faculty_services_1.facultyServices.deleteAFacultyFromDB(id);
    if (!result)
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "user and faculty is not deleted successfully");
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "faculty is deleted successfully",
        data: result,
    });
}));
// update a single faculty
const updateAFaculty = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { faculty } = req.body;
    const result = yield faculty_services_1.facultyServices.updateAFacultyFromDB(id, faculty);
    if (!result)
        throw new appError_1.default(http_status_1.default.NOT_FOUND, " faculty is not found");
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Faculty is updated successfully",
        data: result,
    });
}));
exports.facultyControllers = {
    getAllFaculties,
    getAFaculty,
    deleteAFaculty,
    updateAFaculty,
};
