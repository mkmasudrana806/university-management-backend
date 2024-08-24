"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
// handle all user routes
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const student_validation_zod_1 = require("../student/student.validation.zod");
const faculty_validation_1 = require("../faculty/faculty.validation");
const admin_validation_1 = require("../admin/admin.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
// routes
// create a student
router.post("/create-student", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), sendImageToCloudinary_1.upload.single("file"), // parse the file system
// parse text data into json and set to req.body
(req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequestData_1.default)(student_validation_zod_1.studentValidations.createStudentValidationSchema), user_controller_1.UserControllers.createStudent);
// create a faculty
router.post("/create-faculty", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), sendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequestData_1.default)(faculty_validation_1.FacultyValidations.createFacultyValidationSchema), user_controller_1.UserControllers.createFaculty);
// create a admin
router.post("/create-admin", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), sendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequestData_1.default)(admin_validation_1.adminValidations.createAdminValidationSchema), user_controller_1.UserControllers.createAdmin);
// get me route
router.get("/me", (0, auth_1.default)(user_constant_1.USER_ROLE.student, user_constant_1.USER_ROLE.faculty, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.UserControllers.getMe);
// change user status
router.post("/change-status/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.changeUserStatus);
// export routes
exports.userRoutes = router;
