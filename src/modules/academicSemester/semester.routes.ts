import express from "express";
import { semesterControllers } from "./semester.controller";
import validateRequest from "../../middlewares/validateRequestData";
import { semesterValidations } from "./semester.validation";

const router = express.Router();

// routes
// create a new semester
router.post(
  "/create-semester",
  validateRequest(semesterValidations.createSemesterValidationSchema),
  semesterControllers.createSemester
);

// get all semester
router.get("/", semesterControllers.getAllSemesters);

// get single semester
router.get("/:semesterId", semesterControllers.getSingleSemester);

// update semester
router.patch(
  "/:semesterId",
  validateRequest(semesterValidations.updateSemesterValidationSchema),
  semesterControllers.updateSingleSemester
);

export const semesterRoutes = router;
