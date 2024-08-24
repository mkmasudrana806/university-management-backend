"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const semester_controller_1 = require("./semester.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const semester_validation_1 = require("./semester.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// routes
// create a new semester
router.post("/create-semester", (0, validateRequestData_1.default)(semester_validation_1.semesterValidations.createSemesterValidationSchema), semester_controller_1.semesterControllers.createSemester);
// get all semester
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), semester_controller_1.semesterControllers.getAllSemesters);
// get single semester
router.get("/:semesterId", semester_controller_1.semesterControllers.getSingleSemester);
// update semester
router.patch("/:semesterId", (0, validateRequestData_1.default)(semester_validation_1.semesterValidations.updateSemesterValidationSchema), semester_controller_1.semesterControllers.updateSingleSemester);
exports.semesterRoutes = router;
