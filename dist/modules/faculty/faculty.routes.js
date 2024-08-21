"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyRoutes = void 0;
// handle all faculty routes
const express_1 = __importDefault(require("express"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const faculty_controllers_1 = require("./faculty.controllers");
const faculty_validation_1 = require("./faculty.validation");
const router = express_1.default.Router();
// routes
// get all faculties
router.get("/", 
// auth(USER_ROLE.admin, USER_ROLE.faculty),
faculty_controllers_1.facultyControllers.getAllFaculties);
// get single faculty
router.get("/:id", faculty_controllers_1.facultyControllers.getAFaculty);
// delete single faculty
router.delete("/:id", faculty_controllers_1.facultyControllers.deleteAFaculty);
// update single faculty
router.patch("/:id", (0, validateRequestData_1.default)(faculty_validation_1.FacultyValidations.updateFacultyValidationSchema), faculty_controllers_1.facultyControllers.updateAFaculty);
// export all faculty routes
exports.facultyRoutes = router;
