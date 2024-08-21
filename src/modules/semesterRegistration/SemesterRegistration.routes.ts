import express from "express";
import validateRequest from "../../middlewares/validateRequestData";
import { semesterRegistrationControllers } from "./SemesterRegistration.controller";
import { semesterRegistrationValidations } from "./SemesterRegistration.validation";

const router = express.Router();

// routes
// create a new semester registration
router.post(
  "/create-semester-registration",
  validateRequest(
    semesterRegistrationValidations.createSemesterRegistrationSchema
  ),
  semesterRegistrationControllers.createSemesterRegistration
);

// get all semester registration
router.get("/", semesterRegistrationControllers.getAllSemestersRegistration);

// get a semester registration
router.get("/:id", semesterRegistrationControllers.getSemesterRegistration);

// update a semester registration
router.patch(
  "/:id",
  validateRequest(
    semesterRegistrationValidations.updateSemesterRegistrationSchema
  ),
  semesterRegistrationControllers.updateSemesterRegistration
);

// delete a semester registration
router.delete(
  "/:id",
  semesterRegistrationControllers.deleteSemesterRegistration
);

export const semesterRegistrationRoutes = router;
