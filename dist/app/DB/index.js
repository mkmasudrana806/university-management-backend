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
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = __importDefault(require("../../modules/admin/admin.model"));
const user_constant_1 = require("../../modules/user/user.constant");
const user_model_1 = require("../../modules/user/user.model");
const config_1 = __importDefault(require("../config"));
const appError_1 = __importDefault(require("../../utils/appError"));
const http_status_1 = __importDefault(require("http-status"));
// static superAdmin user data.
const superAdminUser = {
    id: config_1.default.super_admin_id,
    email: config_1.default.super_admin_email,
    password: config_1.default.super_admin_password,
    needsPasswordChange: false,
    role: user_constant_1.USER_ROLE.superAdmin,
    status: "in-progress",
};
// static superAdmin data
const superAdminData = {
    id: config_1.default.super_admin_id,
    name: {
        firstName: "Masud",
        middleName: "Atel",
        lastName: "Rana",
    },
    designation: "superAdmin",
    gender: "male",
    dateOfBirth: "2001-10-15",
    email: config_1.default.super_admin_email,
    contactNo: "01792852446",
    emergencyContactNo: "01590014148",
    bloodGroup: "O+",
    presentAddress: "Raiganj, Sirajganj, Rajshahi",
    profileImg: "",
};
/**
 * if superAdmin doesn't exist in database, it created a super admin when database is connected
 */
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    // when database is connected, we will check is there any user who is super admin
    const isSuperAdminExists = yield user_model_1.User.findOne({ role: user_constant_1.USER_ROLE.superAdmin });
    if (!isSuperAdminExists) {
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const user = yield user_model_1.User.create([superAdminUser], { session });
            if (!user.length) {
                throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a super admin user");
            }
            // set user reference to the admin data
            superAdminData.user = user[0]._id;
            const admin = yield admin_model_1.default.create([superAdminData], { session });
            if (!admin.length) {
                throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a super admin data");
            }
            yield session.commitTransaction();
            yield session.endSession();
            console.log("Super Admin is created successfully");
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a super admin");
        }
    }
});
exports.default = seedSuperAdmin;
