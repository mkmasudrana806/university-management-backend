"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
// handle all admin routes
const express_1 = __importDefault(require("express"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const admin_controllers_1 = require("./admin.controllers");
const admin_validation_1 = require("./admin.validation");
const router = express_1.default.Router();
// routes
// get all admins
router.get("/", admin_controllers_1.adminControllers.getAllAdmins);
// get single admin
router.get("/:id", admin_controllers_1.adminControllers.getSingleAdmin);
// delete single admin
router.delete("/:id", admin_controllers_1.adminControllers.deleteSingleAdmin);
// update single admin
router.patch("/:id", (0, validateRequestData_1.default)(admin_validation_1.adminValidations.updateAdminValidationSchema), admin_controllers_1.adminControllers.updateSingleAdmin);
// export all admin routes
exports.adminRoutes = router;
