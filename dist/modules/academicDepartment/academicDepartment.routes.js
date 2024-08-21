"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicDepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const academicDepartment_validation_1 = require("./academicDepartment.validation");
const academicDepartment_controllers_1 = require("./academicDepartment.controllers");
const router = express_1.default.Router();
// routes
// create a new academic department
router.post("/create-academic-department", (0, validateRequestData_1.default)(academicDepartment_validation_1.academicDepartmentValidations.createAcademicDepartmentValidationSchema), academicDepartment_controllers_1.academicDepartmentControllers.createAcademicDepartment);
// get single department
router.get("/:departmentId", academicDepartment_controllers_1.academicDepartmentControllers.getSingleAcademicDepartment);
// get all department
router.get("/", academicDepartment_controllers_1.academicDepartmentControllers.getAllAcademicDepartment);
// update single academic department
router.patch("/:departmentId", (0, validateRequestData_1.default)(academicDepartment_validation_1.academicDepartmentValidations.updateAcademicDepartmentValidationSchema), academicDepartment_controllers_1.academicDepartmentControllers.updateAcademicDepartment);
exports.academicDepartmentRoutes = router;
