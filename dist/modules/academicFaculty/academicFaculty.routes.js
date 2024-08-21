"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicFacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const academicFaculty_controller_1 = require("./academicFaculty.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const academicFaculty_validations_1 = require("./academicFaculty.validations");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// routes
// create a new faculty
router.post("/create-academic-faculty", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(academicFaculty_validations_1.AcademicFacultyValidations.createAcademicFacultyValidationSchema), academicFaculty_controller_1.academicFacultyControllers.createAcademicFaculty);
// get single faculty
router.get("/:facultyId", academicFaculty_controller_1.academicFacultyControllers.getSingleAcademicFaculty);
// get all faculty
router.get("/", academicFaculty_controller_1.academicFacultyControllers.getAllAcademicFaculty);
// update single academic faculty
router.patch("/:facultyId", (0, validateRequestData_1.default)(academicFaculty_validations_1.AcademicFacultyValidations.updateAcademicFacultyValidationSchema), academicFaculty_controller_1.academicFacultyControllers.updateAcademicFaculty);
exports.academicFacultyRoutes = router;
