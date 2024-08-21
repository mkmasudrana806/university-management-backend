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
exports.adminControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const admin_services_1 = require("./admin.services");
// get all admins
const getAllAdmins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_services_1.adminServices.getAllAdminFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Admins are retrieved successfully",
        data: result,
    });
}));
// get a single admin
const getSingleAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_services_1.adminServices.getSingleAdminFromDB(id);
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Admin not found");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Admin is retrived successfully",
        data: result,
    });
}));
// delete a single admin
const deleteSingleAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_services_1.adminServices.deleteSingleAdminFromDB(id);
    if (!result)
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "user and Admin is not deleted successfully");
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Admin is deleted successfully",
        data: result,
    });
}));
// update a single admin
const updateSingleAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { admin } = req.body;
    const result = yield admin_services_1.adminServices.updateSingleAdminFromDB(id, admin);
    if (!result)
        throw new appError_1.default(http_status_1.default.NOT_FOUND, " Admin is not found");
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Admin is updated successfully",
        data: result,
    });
}));
exports.adminControllers = {
    getAllAdmins,
    getSingleAdmin,
    deleteSingleAdmin,
    updateSingleAdmin,
};
