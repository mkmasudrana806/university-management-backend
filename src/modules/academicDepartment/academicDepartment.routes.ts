import express from "express";

import validateRequest from "../../middlewares/validateRequestData";
import { academicDepartmentValidations } from "./academicDepartment.validation";
import { academicDepartmentControllers } from "./academicDepartment.controllers";

const router = express.Router();

// routes
// create a new academic department
router.post(
  "/create-academic-department",
  validateRequest(
    academicDepartmentValidations.createAcademicDepartmentValidationSchema
  ),
  academicDepartmentControllers.createAcademicDepartment
);

// get single department
router.get(
  "/:departmentId",
  academicDepartmentControllers.getSingleAcademicDepartment
);

// get all department
router.get("/", academicDepartmentControllers.getAllAcademicDepartment);

// update single academic department
router.patch(
  "/:departmentId",
  validateRequest(
    academicDepartmentValidations.updateAcademicDepartmentValidationSchema
  ),
  academicDepartmentControllers.updateAcademicDepartment
);

export const academicDepartmentRoutes = router;
