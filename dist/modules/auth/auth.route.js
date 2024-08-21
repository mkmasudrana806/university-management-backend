"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// login an user
router.post("/login", (0, validateRequestData_1.default)(auth_validation_1.authValidations.loginValidationSchema), auth_controller_1.authControllers.loginUser);
// change password
router.post("/change-password", (0, auth_1.default)(user_constant_1.USER_ROLE.student, user_constant_1.USER_ROLE.faculty, user_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(auth_validation_1.authValidations.changePasswordValidationSchema), auth_controller_1.authControllers.changePassword);
// refresh token
router.post("/refresh-token", (0, validateRequestData_1.default)(auth_validation_1.authValidations.refreshTokenValidationSchema), auth_controller_1.authControllers.refreshToken);
// forget password
router.post("/forgot-password", (0, validateRequestData_1.default)(auth_validation_1.authValidations.forgotPasswordValidationSchema), auth_controller_1.authControllers.forgotPassword);
// reset password
router.post("/reset-password", (0, validateRequestData_1.default)(auth_validation_1.authValidations.resetPasswordValidationSchema), auth_controller_1.authControllers.resetPassword);
exports.authRoutes = router;
