"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRoutes = void 0;
// handle all student routes
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("./student.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const student_validation_zod_1 = require("./student.validation.zod");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// routes
// get all students
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), student_controller_1.studentControllers.getAllStudents);
// get single student
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.faculty, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), student_controller_1.studentControllers.getAStudent);
// delete single student
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), student_controller_1.studentControllers.deleteAStudent);
// update single student
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(student_validation_zod_1.studentValidations.updateStudentValidationSchema), student_controller_1.studentControllers.updateAStudent);
// export all student routes
exports.studentRoutes = router;
