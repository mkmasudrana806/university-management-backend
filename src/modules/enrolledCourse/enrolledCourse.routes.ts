import express from "express";
import { enrolledCourseControllers } from "./enrolledCourse.controller";
import validateRequest from "../../middlewares/validateRequestData";
import { enrolledCourseValidations } from "./enrolledCourse.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// all routes
// create an enrolled course
router.post(
  "/create-enrolled-course",
  auth(USER_ROLE.student),
  validateRequest(
    enrolledCourseValidations.createEnrolledCourseValidationSchema
  ),
  enrolledCourseControllers.createEnrolledCourse
);

// update enrolled course marks
router.post(
  "/update-enrolled-course-marks",
  auth(USER_ROLE.faculty),
  validateRequest(enrolledCourseValidations.updateEnrolledCourseMarksSchema),
  enrolledCourseControllers.updateEnrolledCourseMarks
);

// get my enrolled courses
router.get(
  "/my-enrolled-courses",
  auth(USER_ROLE.student),
  enrolledCourseControllers.getMyEnrolledCourses
);
export const enrolledCourseRoutes = router;
