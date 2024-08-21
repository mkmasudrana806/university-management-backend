// handle all faculty routes
import express from "express";

import validateRequest from "../../middlewares/validateRequestData";
import { facultyControllers } from "./faculty.controllers";
import { FacultyValidations } from "./faculty.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// routes
// get all faculties
router.get(
  "/",
  // auth(USER_ROLE.admin, USER_ROLE.faculty),
  facultyControllers.getAllFaculties
);

// get single faculty
router.get("/:id", facultyControllers.getAFaculty);

// delete single faculty
router.delete("/:id", facultyControllers.deleteAFaculty);

// update single faculty
router.patch(
  "/:id",
  validateRequest(FacultyValidations.updateFacultyValidationSchema),
  facultyControllers.updateAFaculty
);

// export all faculty routes
export const facultyRoutes = router;
