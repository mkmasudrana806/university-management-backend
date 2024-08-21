import express from "express";
import validateRequest from "../../middlewares/validateRequestData";
import { courseValidations } from "./course.validation";
import { courseControllers } from "./course.controller";

const router = express.Router();

// routes
// create a new course
router.post(
  "/create-course",
  validateRequest(courseValidations.createCourseValidationSchema),
  courseControllers.createCourse
);

// get all courses
router.get("/", courseControllers.getAllCourses);

// get single Course
router.get("/:id", courseControllers.getSingleCourse);

// update Course
router.patch(
  "/:id",
  validateRequest(courseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse
);

// delete Course
router.delete("/:id", courseControllers.deleteCourse);

// assign faculties to a course
router.put(
  "/:courseId/assign-faculties",
  validateRequest(courseValidations.assignFacultiesToCourseSchema),
  courseControllers.assignFacultiesToCourse
);

// remove faculties from a course
router.delete(
  "/:courseId/remove-faculties",
  validateRequest(courseValidations.assignFacultiesToCourseSchema),
  courseControllers.removeFacultiesFromCourse
);

// get faculties for a course
router.get(
  "/:courseId/get-faculties",
  courseControllers.getFacultiesWithCourse
);

export const courseRoutes = router;
