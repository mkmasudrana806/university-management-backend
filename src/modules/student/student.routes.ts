// handle all student routes
import express from "express";
import { studentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequestData";
import { studentValidations } from "./student.validation.zod";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// routes
// get all students
router.get("/", studentControllers.getAllStudents);

// get single student
router.get(
  "/:id",
  auth(USER_ROLE.faculty, USER_ROLE.admin),
  studentControllers.getAStudent
);

// delete single student
router.delete("/:id", studentControllers.deleteAStudent);

// update single student
router.patch(
  "/:id",
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentControllers.updateAStudent
);

// export all student routes
export const studentRoutes = router;
