import express from "express";
import validateRequest from "../../middlewares/validateRequestData";
import { authValidations } from "./auth.validation";
import { authControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();

// login an user
router.post(
  "/login",
  validateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser
);

// change password
router.post(
  "/change-password",
  auth(USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.admin),
  validateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword
);

// refresh token
router.post(
  "/refresh-token",
  validateRequest(authValidations.refreshTokenValidationSchema),
  authControllers.refreshToken
);

// forget password
router.post(
  "/forgot-password",
  validateRequest(authValidations.forgotPasswordValidationSchema),
  authControllers.forgotPassword
);

// reset password
router.post(
  "/reset-password",
  validateRequest(authValidations.resetPasswordValidationSchema),
  authControllers.resetPassword
);

export const authRoutes = router;
