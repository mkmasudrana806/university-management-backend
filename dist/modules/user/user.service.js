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
// TODO: uncomment it, and remove below createStudentIntoDb method
// create student into db
// const createStudentIntoDB = async (password: string, payload: TStudent) => {
//   // create a user and studentData object
//   const userData: Partial<TUser> = {};
//   // if password is not provided, use default password
//   userData.password = password || (config.default_password as string);
//   // set student role
//   userData.role = "student";
//   // find semester information
//   const admissionSemester = (await Semester.findById(
//     payload.admissionSemester
//   )) as TAcademicSemester;
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     // set generated id
//     userData.id = await userUtils.generateStudentId(admissionSemester);
//     // create a new user: (transaction-1)
//     const newUser = await User.create([userData], { session });
//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
//     }
//     // set id, _id as user
//     payload.id = newUser[0].id;
//     payload.user = newUser[0]._id; // reference id
//     // create a student (transaction-2)
//     const newStudent = await Student.create([payload], { session });
//     if (!newStudent.length) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Faild to create a new student"
//       );
//     }
//     await session.commitTransaction();
//     await session.endSession();
//     return newStudent[0];
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(httpStatus.BAD_REQUEST, "faild to create a new student");
//   }
// };
// without transaction.
const createStudentIntoDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // create a user and studentData object
    const userData = {};
    // if password is not provided, use default password
    userData.password = password || config_1.default.default_password;
    // set user role and user email
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
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Academic faculty not found");
    }
    // set academicFaculty data
    payload.academicFaculty = academicDepartment.academicFaculty;
    // set generated id
    userData.id = yield user_utils_1.userUtils.generateStudentId(admissionSemester);
    // send image to cloudinary
    const imageName = `${userData.id}-${payload.name.firstName}`;
    const path = file === null || file === void 0 ? void 0 : file.path;
    const profileImage = yield (0, sendImageToCloudinary_1.default)(imageName, path);
    // set profileImg
    payload.profileImg = profileImage.secure_url;
    // create a new user: (transaction-1)
    const newUser = yield user_model_1.User.create(userData);
    if (!newUser) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new user");
    }
    // set id, _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; // reference id
    // create a student (transaction-2)
    const newStudent = yield student_model_1.default.create(payload);
    if (!newStudent) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new student");
    }
    return newStudent;
});
// TODO: uncomment this, and rmeove below method.
// create faculty into db
// const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
//   // create a user data object
//   const userData: Partial<TUser> = {};
//   // if password is not provided, use default password
//   userData.password = password || (config.default_password as string);
//   // set user role
//   userData.role = "faculty";
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     // set generated id
//     userData.id = await userUtils.generateFacultyId();
//     // create a new user: (transaction-1)
//     const newUser = await User.create([userData], { session });
//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
//     }
//     // set id, _id as user
//     payload.id = newUser[0].id;
//     payload.user = newUser[0]._id; // reference id
//     // create a faculty (transaction-2)
//     const newFaculty = await Faculty.create([payload], { session });
//     if (!newFaculty.length) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Faild to create a new Faculty in second transaction"
//       );
//     }
//     await session.commitTransaction();
//     await session.endSession();
//     return newFaculty[0];
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "faild to create a new faculty in rollback"
//     );
//   }
// };
const createFacultyIntoDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // create a user data object
    const userData = {};
    // if password is not provided, use default password
    userData.password = password || config_1.default.default_password;
    // set user role and user email
    userData.role = "faculty";
    userData.email = payload.email;
    // set generated id
    userData.id = yield user_utils_1.userUtils.generateFacultyId();
    // send image to cloudinary
    const imageName = `${userData.id}-${payload.name.firstName}`;
    const path = file === null || file === void 0 ? void 0 : file.path;
    const profileImage = yield (0, sendImageToCloudinary_1.default)(imageName, path);
    // set profileImg
    payload.profileImg = profileImage.secure_url;
    // create a new user: (transaction-1)
    const newUser = yield user_model_1.User.create(userData);
    if (!newUser) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new user");
    }
    // set id, _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; // reference id
    // create a faculty (transaction-2)
    const newFaculty = yield faculty_model_1.default.create(payload);
    if (!newFaculty) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new Faculty in second transaction");
    }
    return newFaculty;
});
// TODO: uncomment this, and remove below method.
// create admin into db
// const createAdminIntoDB = async (password: string, payload: TAdmin) => {
//   // create a user data object
//   const userData: Partial<TUser> = {};
//   // if password is not provided, use default password
//   userData.password = password || (config.default_password as string);
//   // set user role
//   userData.role = "admin";
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     // set generated id
//     userData.id = await userUtils.generateAdminId();
//     // create a new user: (transaction-1)
//     const newUser = await User.create([userData], { session });
//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
//     }
//     // set id, _id as user
//     payload.id = newUser[0].id;
//     payload.user = newUser[0]._id; // reference id
//     // create a Admin (transaction-2)
//     const newAdmin = await Admin.create([payload], { session });
//     if (!newAdmin.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new admin");
//     }
//     await session.commitTransaction();
//     await session.endSession();
//     return newAdmin[0];
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "faild to create a new admin in rollback"
//     );
//   }
// };
// temporary without transaction
// create admin into db
const createAdminIntoDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // create a user data object
    const userData = {};
    // if password is not provided, use default password
    userData.password = password || config_1.default.default_password;
    // set user role and user email
    userData.role = "admin";
    userData.email = payload.email;
    // set generated id
    userData.id = yield user_utils_1.userUtils.generateAdminId();
    // send image to cloudinary
    const imageName = `${userData.id}-${payload.name.firstName}`;
    const path = file === null || file === void 0 ? void 0 : file.path;
    const profileImage = yield (0, sendImageToCloudinary_1.default)(imageName, path);
    // set profileImg
    payload.profileImg = profileImage.secure_url;
    // create a new user: (transaction-1)
    const newUser = yield user_model_1.User.create(userData);
    if (!newUser) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new user");
    }
    // set id, _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; // reference id
    // create a Admin (transaction-2)
    const newAdmin = yield admin_model_1.default.create(payload);
    if (!newAdmin) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to create a new admin");
    }
    return newAdmin;
});
// -------------------- getMe --------------------
const getMe = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === user_constant_1.USER_ROLE.student) {
        result = yield student_model_1.default.findOne({ id: userId }).populate("user");
    }
    if (role === user_constant_1.USER_ROLE.faculty) {
        result = yield faculty_model_1.default.findOne({ id: userId }).populate("user");
    }
    if (role === user_constant_1.USER_ROLE.admin) {
        result = yield admin_model_1.default.findOne({ id: userId }).populate("user");
    }
    return result;
});
// -------------------- changeUserStatus --------------------
const changeUserStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { newUser: true });
    return result;
});
exports.UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe,
    changeUserStatus,
};
