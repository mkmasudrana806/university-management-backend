import express from "express";
import { academicFacultyControllers } from "./academicFaculty.controller";
import validateRequest from "../../middlewares/validateRequestData";
import { AcademicFacultyValidations } from "./academicFaculty.validations";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// routes
// create a new faculty
router.post(
  "/create-academic-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicFacultyValidations.createAcademicFacultyValidationSchema
  ),
  academicFacultyControllers.createAcademicFaculty
);

// get single faculty
router.get("/:facultyId", academicFacultyControllers.getSingleAcademicFaculty);

// get all faculty
router.get("/", academicFacultyControllers.getAllAcademicFaculty);

// update single academic faculty
router.patch(
  "/:facultyId",
  validateRequest(
    AcademicFacultyValidations.updateAcademicFacultyValidationSchema
  ),
  academicFacultyControllers.updateAcademicFaculty
);

export const academicFacultyRoutes = router;
