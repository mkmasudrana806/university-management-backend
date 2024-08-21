import express from "express";
import validateRequest from "../../middlewares/validateRequestData";
import { offeredCourseControllers } from "./offeredCourse.controller";
import { offeredCourseValidations } from "./offeredCourse.validation";

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
