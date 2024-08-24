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
exports.UserServices = void 0;
const config_1 = __importDefault(require("../../app/config"));
const semester_model_1 = require("../academicSemester/semester.model");
const student_model_1 = __importDefault(require("../student/student.model"));
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const appError_1 = __importDefault(require("../../utils/appError"));
const http_status_1 = __importDefault(require("http-status"));
const faculty_model_1 = __importDefault(require("../faculty/faculty.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const user_constant_1 = require("./user.constant");
const sendImageToCloudinary_1 = __importDefault(require("../../utils/sendImageToCloudinary"));
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * create a student into db
 *
 * @param file image file from client
 * @param password new student password
 * @param payload new student data
 * @validations check semester, academic department exists.
 * @features abort transaction if it faild to create a student or an user otherwise commit it
 * @features dynamically handle user data in backend
 * @returns newly created student data
 */
const createStudentIntoDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {};
    // check if the email address already exists
    const isEmailExists = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (isEmailExists) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, `${payload.email} is already exists`);
    }
    // set default password, role and email address
    userData.password = password || config_1.default.default_password;
    userData.role = "student";
    userData.email = payload.email;
    // find semester information
    const admissionSemester = (yield semester_model_1.Semester.findById(payload.admissionSemester));
    if (!admissionSemester) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Admission Semester not found");
    }
    // find academic department
    const academicDepartment = yield academicDepartment_model_1.AcademicDepartment.findById(payload.academicDepartment);
    if (!academicDepartment) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Academic Department not found");
    }
    // set academicFaculty data
    payload.academicFaculty = academicDepartment.academicFaculty;
    // set generated id
    userData.id = yield user_utils_1.userUtils.generateStudentId(admissionSemester);
    // send image to cloudinary and set profileImg as cloudinary secure_url
    if (file) {
        const imageName = `${userData.id}-${payload.name.firstName}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        const profileImage = yield (0, sendImageToCloudinary_1.default)(imageName, path);
        payload.profileImg = profileImage.secure_url;
    }
    const session = yield mongoose_1.default.startSession();
    try {
        // start transaction
        session.startTransaction();
        // create a new user: (transaction-1)
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new user");
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; // user reference to student data
        // create a student (transaction-2)
        const newStudent = yield student_model_1.default.create([payload], { session });
        if (!newStudent.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new student");
        }
        // commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return newStudent;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Faild to create a student and uesr");
    }
});
/**
 * create a faculty into db
 *
 * @param file image file from client
 * @param password new faculty password
 * @param payload new faculty data
 * @features dynamically handle user data in backend
 * @features abort transaction if it faild to create a faculty or an user otherwise commit it
 * @returns newly created faculty data
 */
const createFacultyIntoDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // create a user data object
    const userData = {};
    // check if the email address already exists
    const isEmailExists = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (isEmailExists) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, `${payload.email} is already exists`);
    }
    // set default password, role, email and generated id
    userData.password = password || config_1.default.default_password;
    userData.role = "faculty";
    userData.email = payload.email;
    // set generated id
    userData.id = yield user_utils_1.userUtils.generateFacultyId();
    // send image to cloudinary and set profileImg as cloudinary secure_url
    if (file) {
        const imageName = `${userData.id}-${payload.name.firstName}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        const profileImage = yield (0, sendImageToCloudinary_1.default)(imageName, path);
        payload.profileImg = profileImage.secure_url;
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // create a new user: (transaction-1)
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new user");
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; // reference id to user
        // create a faculty (transaction-2)
        const newFaculty = yield faculty_model_1.default.create([payload], { session });
        if (!newFaculty.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new Faculty in second transaction");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newFaculty;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a faculty");
    }
});
/**
 * create an admin into db
 *
 * @param file image file from client
 * @param password new admin password
 * @param payload new admin data
 * @features dynamically handle user data in backend
 * @features abort transaction if it faild to create an admin or an user otherwise commit it
 * @returns newly created faculty data
 */
const createAdminIntoDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // create a user data object
    const userData = {};
    // check if the email address already exists
    const isEmailExists = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (isEmailExists) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, `${payload.email} is already exists`);
    }
    // set default password, role, email and generated id
    userData.password = password || config_1.default.default_password;
    userData.role = "admin";
    userData.email = payload.email;
    userData.id = yield user_utils_1.userUtils.generateAdminId();
    // send image to cloudinary and set profileImg as cloudinary secure_url
    if (file) {
        const imageName = `${userData.id}-${payload.name.firstName}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        const profileImage = yield (0, sendImageToCloudinary_1.default)(imageName, path);
        payload.profileImg = profileImage.secure_url;
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // create a new user: (transaction-1)
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new user");
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; // add reference to user property
        // create an Admin (transaction-2)
        const newAdmin = yield admin_model_1.default.create([payload], { session });
        if (!newAdmin.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new admin");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newAdmin;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create an admin");
    }
});
/**
 * -------------------- getMe --------------------
 *
 * @param userId custom user id
 * @param role user role like 'student' or 'admin' or 'faculty' or 'superAdmin'
 * @returns base on role, return that user data
 */
const getMe = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === user_constant_1.USER_ROLE.student) {
        result = yield student_model_1.default.findOne({ id: userId }).populate("user");
    }
    else if (role === user_constant_1.USER_ROLE.faculty) {
        result = yield faculty_model_1.default.findOne({ id: userId }).populate("user");
    }
    else if (role === user_constant_1.USER_ROLE.admin || role === user_constant_1.USER_ROLE.superAdmin) {
        result = yield admin_model_1.default.findOne({ id: userId }).populate("user");
    }
    return result;
});
/**
 *  -------------------- changeUserStatus --------------------
 *
 * @param currentAdminRole it can be superAdmin or admin
 * @param id user id (mongodb _id)
 * @param payload user status like 'in-progress' or 'blocked
 * @validation check user exists, or deleted, or is already blocked
 * @features superAdmin can change anyone status except ownself. admin can change faculty and student status except ownself.
 * @returns return updated user
 */
const changeUserStatus = (currentAdminRole, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    // check if the user is already deleted
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    // check user status
    if ((user === null || user === void 0 ? void 0 : user.status) === "blocked") {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Requested user is already blocked!");
    }
    // allow superAdmin to change status of a student, faculty, and admin. ownself is not allowed
    if (currentAdminRole === user_constant_1.USER_ROLE.superAdmin &&
        user.role === user_constant_1.USER_ROLE.superAdmin) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "As a superAdmin, You can not change ownself status");
    }
    // allow admin to change status of student and faculty. ownself is not allowed
    if ((currentAdminRole === user_constant_1.USER_ROLE.admin &&
        user.role === user_constant_1.USER_ROLE.superAdmin) ||
        (currentAdminRole === user_constant_1.USER_ROLE.admin && user.role === user_constant_1.USER_ROLE.admin)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Admin can't change another admin or superAdmin status!");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe,
    changeUserStatus,
};
