"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrolledCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const enrolledCourse_controller_1 = require("./enrolledCourse.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const enrolledCourse_validation_1 = require("./enrolledCourse.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// all routes
// create an enrolled course
router.post("/create-enrolled-course", (0, auth_1.default)(user_constant_1.USER_ROLE.student), (0, validateRequestData_1.default)(enrolledCourse_validation_1.enrolledCourseValidations.createEnrolledCourseValidationSchema), enrolledCourse_controller_1.enrolledCourseControllers.createEnrolledCourse);
// update enrolled course marks
router.post("/update-enrolled-course-marks", (0, auth_1.default)(user_constant_1.USER_ROLE.faculty), (0, validateRequestData_1.default)(enrolledCourse_validation_1.enrolledCourseValidations.updateEnrolledCourseMarksSchema), enrolledCourse_controller_1.enrolledCourseControllers.updateEnrolledCourseMarks);
// get my enrolled courses
router.get("/my-enrolled-courses", (0, auth_1.default)(user_constant_1.USER_ROLE.student), enrolledCourse_controller_1.enrolledCourseControllers.getMyEnrolledCourses);
exports.enrolledCourseRoutes = router;
