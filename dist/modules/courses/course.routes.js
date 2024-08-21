"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const course_validation_1 = require("./course.validation");
const course_controller_1 = require("./course.controller");
const router = express_1.default.Router();
// routes
// create a new course
router.post("/create-course", (0, validateRequestData_1.default)(course_validation_1.courseValidations.createCourseValidationSchema), course_controller_1.courseControllers.createCourse);
// get all courses
router.get("/", course_controller_1.courseControllers.getAllCourses);
// get single Course
router.get("/:id", course_controller_1.courseControllers.getSingleCourse);
// update Course
router.patch("/:id", (0, validateRequestData_1.default)(course_validation_1.courseValidations.updateCourseValidationSchema), course_controller_1.courseControllers.updateCourse);
// delete Course
router.delete("/:id", course_controller_1.courseControllers.deleteCourse);
// assign faculties to a course
router.put("/:courseId/assign-faculties", (0, validateRequestData_1.default)(course_validation_1.courseValidations.assignFacultiesToCourseSchema), course_controller_1.courseControllers.assignFacultiesToCourse);
// remove faculties from a course
router.delete("/:courseId/remove-faculties", (0, validateRequestData_1.default)(course_validation_1.courseValidations.assignFacultiesToCourseSchema), course_controller_1.courseControllers.removeFacultiesFromCourse);
exports.courseRoutes = router;
