import express from "express";
import validateRequest from "../../middlewares/validateRequestData";
import { offeredCourseControllers } from "./offeredCourse.controller";
import { offeredCourseValidations } from "./offeredCourse.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// routes
// create a new offered course
router.post(
  "/create-offered-course",
  validateRequest(offeredCourseValidations.createOfferedCourseSchema),
  offeredCourseControllers.createOfferedCourse
);

// get all offered courses
router.get("/", offeredCourseControllers.getAllOfferedCourses);

// get all offered courses
router.get(
  "/my-offered-courses",
  auth(USER_ROLE.student),
  offeredCourseControllers.getMyOfferedCourses
);

// get an offered course
router.get("/:id", offeredCourseControllers.getOfferedCourse);

// delete an offered course
router.delete("/:id", offeredCourseControllers.deleteOfferedCourse);

// update an offered course
router.patch(
  "/:id",
  validateRequest(offeredCourseValidations.updateOfferedCourseSchema),
  offeredCourseControllers.updateOfferedCourse
);

export const offeredCourseRoutes = router;
