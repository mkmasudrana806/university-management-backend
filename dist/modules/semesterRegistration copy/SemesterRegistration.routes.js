"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterRegistrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const SemesterRegistration_controller_1 = require("./SemesterRegistration.controller");
const SemesterRegistration_validation_1 = require("./SemesterRegistration.validation");
const router = express_1.default.Router();
// routes
// create a new semester registration
router.post("/create-semester-registration", (0, validateRequestData_1.default)(SemesterRegistration_validation_1.semesterRegistrationValidations.createSemesterRegistrationSchema), SemesterRegistration_controller_1.semesterRegistrationControllers.createSemesterRegistration);
// get all semester registration
router.get("/", SemesterRegistration_controller_1.semesterRegistrationControllers.getAllSemestersRegistration);
// get a semester registration
router.get("/:id", SemesterRegistration_controller_1.semesterRegistrationControllers.getSemesterRegistration);
// update a semester registration
router.patch("/:id", (0, validateRequestData_1.default)(SemesterRegistration_validation_1.semesterRegistrationValidations.updateSemesterRegistrationSchema), SemesterRegistration_controller_1.semesterRegistrationControllers.updateSemesterRegistration);
exports.semesterRegistrationRoutes = router;
