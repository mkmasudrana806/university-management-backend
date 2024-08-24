// handle all user routes
import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";

import validateRequest from "../../middlewares/validateRequestData";
import { studentValidations } from "../student/student.validation.zod";
import { FacultyValidations } from "../faculty/faculty.validation";
import { adminValidations } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { upload } from "../../utils/sendImageToCloudinary";
import { UserValidation } from "./user.validation";

const router = express.Router();

// routes
// create a student
router.post(
  "/create-student",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single("file"), // parse the file system
  // parse text data into json and set to req.body
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent
);

// create a faculty
router.post(
  "/create-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty
);

// create a admin
router.post(
  "/create-admin",
  auth(USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin
);

// get me route
router.get(
  "/me",
  auth(
    USER_ROLE.student,
    USER_ROLE.faculty,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  UserControllers.getMe
);

// change user status
router.patch(
  "/change-status/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UserValidation.changeUserStatusValidationSchema),
  UserControllers.changeUserStatus
);

// export routes
export const userRoutes = router;
