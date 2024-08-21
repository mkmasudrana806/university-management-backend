// handle all admin routes
import express from "express";

import validateRequest from "../../middlewares/validateRequestData";
import { adminControllers } from "./admin.controllers";
import { adminValidations } from "./admin.validation";

const router = express.Router();

// routes
// get all admins
router.get("/", adminControllers.getAllAdmins);

// get single admin
router.get("/:id", adminControllers.getSingleAdmin);

// delete single admin
router.delete("/:id", adminControllers.deleteSingleAdmin);

// update single admin
router.patch(
  "/:id",
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateSingleAdmin
);

// export all admin routes
export const adminRoutes = router;
