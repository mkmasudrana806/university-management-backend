import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

// type for user
export type TUser = {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: "student" | "faculty" | "admin" | "superAdmin";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
};

// user model
export interface IUserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser | null>;
  isPasswordMatched(
    plainPassword: string,
    hashPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChange(
    passwordChangedTimestamp: Date,
    jwtIssuedtimestamp: number
  ): boolean;
}

// user role type
export type TUserRole = keyof typeof USER_ROLE;
