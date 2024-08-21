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
exports.authControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../app/config"));
// --------------- login an user --------------------
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, accessToken, needsPasswordChange } = yield auth_service_1.authServices.loginUserIntoDB(req.body);
    // set refresh token to cookie
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.node_env === "production" || false,
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User is logged in successfully",
        data: { accessToken, needsPasswordChange },
    });
}));
// --------------- change password --------------------
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authServices.changePasswordIntoDB(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User password is changed successfully",
        data: result,
    });
}));
// -------------------- refresh token ---------------------
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const { accessToken } = yield auth_service_1.authServices.refreshTokenSetup(refreshToken);
    console.log(accessToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token is created successfully",
        data: accessToken,
    });
}));
// -------------------- forgot password ---------------------
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.id;
    const result = yield auth_service_1.authServices.forgotPasswordIntoDb(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reset link is generated successfully",
        data: result,
    });
}));
// -------------------- reset password ---------------------
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, newPassword } = req.body;
    const token = req.headers.authorization;
    const result = yield auth_service_1.authServices.resetPasswordIntoDb(id, newPassword, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Your password is reset successfully",
        data: result,
    });
}));
exports.authControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgotPassword,
    resetPassword,
};
