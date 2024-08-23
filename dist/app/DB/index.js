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
const user_constant_1 = require("../../modules/user/user.constant");
const user_model_1 = require("../../modules/user/user.model");
const config_1 = __importDefault(require("../config"));
// static superAdmin data.
const superAdminUser = {
    id: "0001",
    email: "superadmin@gmail.com",
    password: config_1.default.super_admin_password,
    needsPasswordChange: false,
    role: user_constant_1.USER_ROLE.superAdmin,
    status: "in-progress",
    isDeleted: false,
};
/**
 * if superAdmin doesn't exist in database, it created a super admin when database is connected
 */
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    // when database is connected, we will check is there any user who is super admin
    const isSuperAdminExists = yield user_model_1.User.findOne({ role: user_constant_1.USER_ROLE.superAdmin });
    if (!isSuperAdminExists) {
        yield user_model_1.User.create(superAdminUser);
    }
});
exports.default = seedSuperAdmin;
