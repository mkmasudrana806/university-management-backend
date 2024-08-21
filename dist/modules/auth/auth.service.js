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
exports.authServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../utils/appError"));
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../app/config"));
const auth_utils_1 = require("./auth.utils");
const senEmail_1 = __importDefault(require("../../utils/senEmail"));
// ----------------- login user into database -----------------------
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is exists
    const user = yield user_model_1.User.isUserExistsByCustomId(payload === null || payload === void 0 ? void 0 : payload.id);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    // check if the user is already deleted
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    // check user status
    if ((user === null || user === void 0 ? void 0 : user.status) === "blocked") {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Password is not matched!");
    }
    // jwt data
    const jwtPayload = { userId: user === null || user === void 0 ? void 0 : user.id, role: user === null || user === void 0 ? void 0 : user.role };
    //create AccessToken
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //create   RefreshToken
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        needsPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
        refreshToken,
    };
});
// ---------------------- refresh token -----------------------
const refreshTokenSetup = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the token is sent from the client
    if (!token) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized, as not token give");
    }
    // check if the refresh token is valid
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { userId, iat } = decoded;
    // check if the user is exists
    const user = yield user_model_1.User.isUserExistsByCustomId(userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    // check if the user is already deleted
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    // check user status
    if ((user === null || user === void 0 ? void 0 : user.status) === "blocked") {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    if (user.passwordChangedAt &&
        user_model_1.User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat)) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized, your refresh token is invalid!");
    }
    const accessToken = (0, auth_utils_1.createToken)(jsonwebtoken_1.default, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
// --------------- change password --------------------
const changePasswordIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is exists
    const user = yield user_model_1.User.isUserExistsByCustomId(userData.userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    // check if the user is already deleted
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    // check user status
    if ((user === null || user === void 0 ? void 0 : user.status) === "blocked") {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // checking if the password is correct
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.oldPassword, user === null || user === void 0 ? void 0 : user.password))) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Password is not matched!");
    }
    // hash the new password
    const hashPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    // update the password
    const result = yield user_model_1.User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role,
    }, {
        password: hashPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    }, { new: true });
    return result;
});
// -------------------- forgot password --------------------
const forgotPasswordIntoDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is exists
    const user = yield user_model_1.User.isUserExistsByCustomId(id);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    // check if the user is already deleted
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    // check user status
    if ((user === null || user === void 0 ? void 0 : user.status) === "blocked") {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // jwt data
    const jwtPayload = { userId: user === null || user === void 0 ? void 0 : user.id, role: user === null || user === void 0 ? void 0 : user.role };
    //create AccessToken
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, "10m");
    console.log(user.email);
    const resetUILink = `${config_1.default.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;
    const result = yield (0, senEmail_1.default)(user === null || user === void 0 ? void 0 : user.email, `<p>${resetUILink}</p>`);
    return result;
});
// -------------------- reset password --------------------
const resetPasswordIntoDb = (id, newPassword, token) => __awaiter(void 0, void 0, void 0, function* () {
    // verify the token
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    if (!decoded) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized!, you have not access!");
    }
    // check if the id and id of the token is same
    if (decoded.userId !== id) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized!, your id is not matching!");
    }
    // check if the user is exists
    const user = yield user_model_1.User.isUserExistsByCustomId(id);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    // check if the user is already deleted
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    // check user status
    if ((user === null || user === void 0 ? void 0 : user.status) === "blocked") {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    // hash the new password
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_model_1.User.findOneAndUpdate({ id: id }, { password: hashPassword }, { new: true });
    return result;
});
exports.authServices = {
    loginUserIntoDB,
    changePasswordIntoDB,
    refreshTokenSetup,
    forgotPasswordIntoDb,
    resetPasswordIntoDb,
};
