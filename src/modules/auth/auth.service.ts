import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../app/config";
import { createToken, verifyToken } from "./auth.utils";
import sendEmail from "../../utils/senEmail";
import { decode } from "punycode";

// ----------------- login user into database -----------------------
const loginUserIntoDB = async (payload: TLoginUser) => {
  // check if the user is exists
  const user = await User.isUserExistsByCustomId(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  // check if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }

  // check user status
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not matched!");
  }

  // jwt data
  const jwtPayload = { userId: user?.id, role: user?.role };

  //create AccessToken
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  //create   RefreshToken
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
    refreshToken,
  };
};

// ---------------------- refresh token -----------------------
const refreshTokenSetup = async (token: string) => {
  // check if the token is sent from the client
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized, as not token give"
    );
  }

  // check if the refresh token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // check if the user is exists
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // check if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }

  // check user status
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized, your refresh token is invalid!"
    );
  }
  // jwt data
  const jwtPayload = { userId: user?.id, role: user?.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

// --------------- change password --------------------
const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // check if the user is exists
  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // check if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }

  // check user status
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not matched!");
  }

  // hash the new password
  const hashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // update the password
  const result = await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: hashPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );

  return result;
};

// -------------------- forgot password --------------------
const forgotPasswordIntoDb = async (id: string) => {
  // check if the user is exists
  const user: any = await User.isUserExistsByCustomId(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // check if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }

  // check user status
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // jwt data
  const jwtPayload = { userId: user?.id, role: user?.role };

  //create AccessToken
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  console.log(user.email);
  const resetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;
  const result = await sendEmail(user?.email, `<p>${resetUILink}</p>`);
  return result;
};

// -------------------- reset password --------------------
const resetPasswordIntoDb = async (
  id: string,
  newPassword: string,
  token: string
) => {
  // verify the token
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (!decoded) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized!, you have not access!"
    );
  }

  // check if the id and id of the token is same
  if (decoded.userId !== id) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized!, your id is not matching!"
    );
  }

  // check if the user is exists
  const user: any = await User.isUserExistsByCustomId(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // check if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }

  // check user status
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // hash the new password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await User.findOneAndUpdate(
    { id: id },
    { password: hashPassword },
    { new: true }
  );

  return result;
};

export const authServices = {
  loginUserIntoDB,
  changePasswordIntoDB,
  refreshTokenSetup,
  forgotPasswordIntoDb,
  resetPasswordIntoDb,
};
