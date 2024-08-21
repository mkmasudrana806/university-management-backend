"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offeredCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const offeredCourse_controller_1 = require("./offeredCourse.controller");
const offeredCourse_validation_1 = require("./offeredCourse.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// routes
// create a new offered course
router.post("/create-offered-course", (0, validateRequestData_1.default)(offeredCourse_validation_1.offeredCourseValidations.createOfferedCourseSchema), offeredCourse_controller_1.offeredCourseControllers.createOfferedCourse);
// get all offered courses
router.get("/", offeredCourse_controller_1.offeredCourseControllers.getAllOfferedCourses);
// get all offered courses
router.get("/my-offered-courses", (0, auth_1.default)(user_constant_1.USER_ROLE.student), offeredCourse_controller_1.offeredCourseControllers.getMyOfferedCourses);
// get an offered course
router.get("/:id", offeredCourse_controller_1.offeredCourseControllers.getOfferedCourse);
// delete an offered course
router.delete("/:id", offeredCourse_controller_1.offeredCourseControllers.deleteOfferedCourse);
// update an offered course
router.patch("/:id", (0, validateRequestData_1.default)(offeredCourse_validation_1.offeredCourseValidations.updateOfferedCourseSchema), offeredCourse_controller_1.offeredCourseControllers.updateOfferedCourse);
exports.offeredCourseRoutes = router;
