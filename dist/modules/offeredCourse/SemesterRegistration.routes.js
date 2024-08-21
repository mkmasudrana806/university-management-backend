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
const router = express_1.default.Router();
// routes
// create a new semester registration
router.post("/create-semester-registration", (0, validateRequestData_1.default)(offeredCourse_validation_1.offeredCourseValidations.createofferedCourseSchema), offeredCourse_controller_1.offeredCourseControllers.createofferedCourse);
// get all semester registration
router.get("/", offeredCourse_controller_1.offeredCourseControllers.getAllSemestersRegistration);
// get a semester registration
router.get("/:id", offeredCourse_controller_1.offeredCourseControllers.getofferedCourse);
// update a semester registration
router.patch("/:id", (0, validateRequestData_1.default)(offeredCourse_validation_1.offeredCourseValidations.updateofferedCourseSchema), offeredCourse_controller_1.offeredCourseControllers.updateofferedCourse);
exports.offeredCourseRoutes = router;
