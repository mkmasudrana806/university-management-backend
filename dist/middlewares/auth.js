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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../app/config"));
const user_model_1 = require("../modules/user/user.model");
/**
 * auth middleware to verify jwt Token
 *
 * @param requiredRoles required roles. like auth('student', 'admin')
 * @validations token verify and check user exists or deleted or blocked.
 * @validations jwt expires date verify with last password change time and authorization check
 * @returns set user token object to query object and return to next middleware
 * @mechanism client -> route -> `auth` -> zod validation -> controller -> service -> mongoose -> mongodb database
 */
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // check if the token is sent from the client
        if (!token) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!, token is missing");
        }
        let decoded;
        try {
            // check if the token is valid
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        const { userId, role, iat } = decoded;
        // check if the user is exists
        const user = yield user_model_1.User.isUserExistsByCustomId(userId);
        if (!user) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Auth user is not found!");
        }
        // check if the user is already deleted
        if (user === null || user === void 0 ? void 0 : user.isDeleted) {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, "Auth user is already deleted!");
        }
        // check user status
        if ((user === null || user === void 0 ? void 0 : user.status) === "blocked") {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, "Auth user is alreayd blocked!");
        }
        if (user.passwordChangedAt &&
            user_model_1.User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat)) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized, your token is invalid!");
        }
        // check if the user is authorized access
        if (requiredRoles.length > 0 && !(requiredRoles === null || requiredRoles === void 0 ? void 0 : requiredRoles.includes(role))) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
