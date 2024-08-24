import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../app/config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

/**
 * auth middleware to verify jwt Token
 *
 * @param requiredRoles required roles. like auth('student', 'admin')
 * @validations token verify and check user exists or deleted or blocked.
 * @validations jwt expires date verify with last password change time and authorization check
 * @returns set user token object to query object and return to next middleware
 * @mechanism client -> route -> `auth` -> zod validation -> controller -> service -> mongoose -> mongodb database
 */

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // check if the token is sent from the client
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized, as not token give"
      );
    }

    let decoded;
    try {
      // check if the token is valid
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }
    const { userId, role, iat } = decoded;

    // check if the user is exists
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User is not found in auth!");
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
      User.isJWTIssuedBeforePasswordChange(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized, your token is invalid!"
      );
    }

    // check if the user is authorized access
    if (requiredRoles.length > 0 && !requiredRoles?.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized, as required role is not matches"
      );
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
