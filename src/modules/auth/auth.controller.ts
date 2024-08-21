import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../app/config";
import AppError from "../../utils/appError";

// --------------- login an user --------------------
const loginUser = catchAsync(async (req, res) => {
  const { refreshToken, accessToken, needsPasswordChange } =
    await authServices.loginUserIntoDB(req.body);

  // set refresh token to cookie
  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production" || false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully",
    data: { accessToken, needsPasswordChange },
  });
});

// --------------- change password --------------------
const changePassword = catchAsync(async (req, res) => {
  const result = await authServices.changePasswordIntoDB(
    req.user as JwtPayload,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User password is changed successfully",
    data: result,
  });
});

// -------------------- refresh token ---------------------
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await authServices.refreshTokenSetup(refreshToken);
  console.log(accessToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is created successfully",
    data: accessToken,
  });
});

// -------------------- forgot password ---------------------
const forgotPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const result = await authServices.forgotPasswordIntoDb(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset link is generated successfully",
    data: result,
  });
});

// -------------------- reset password ---------------------
const resetPassword = catchAsync(async (req, res) => {
  const { id, newPassword } = req.body;
  const token = req.headers.authorization as string;
  const result = await authServices.resetPasswordIntoDb(id, newPassword, token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your password is reset successfully",
    data: result,
  });
});



export const authControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
