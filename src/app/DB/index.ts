import mongoose, { Types } from "mongoose";
import Admin from "../../modules/admin/admin.model";
import { USER_ROLE } from "../../modules/user/user.constant";
import { User } from "../../modules/user/user.model";
import config from "../config";
import AppError from "../../utils/appError";
import httpStatus from "http-status";

type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

type TSuperAdmin = {
  id: string;
  user?: Types.ObjectId;
  name: TUserName;
  designation: string;
  gender: string;
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: string;
  presentAddress: string;
  profileImg?: string;
};

// static superAdmin user data.
const superAdminUser = {
  id: config.super_admin_id,
  email: config.super_admin_email,
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
};

// static superAdmin data
const superAdminData: TSuperAdmin = {
  id: config.super_admin_id as string,
  name: {
    firstName: "Masud",
    middleName: "Atel",
    lastName: "Rana",
  },
  designation: "superAdmin",
  gender: "male",
  dateOfBirth: "2001-10-15",
  email: config.super_admin_email as string,
  contactNo: "01792852446",
  emergencyContactNo: "01590014148",
  bloodGroup: "O+",
  presentAddress: "Raiganj, Sirajganj, Rajshahi",
  profileImg: "",
};

/**
 * if superAdmin doesn't exist in database, it created a super admin when database is connected
 */
const seedSuperAdmin = async () => {
  // when database is connected, we will check is there any user who is super admin
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!isSuperAdminExists) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const user = await User.create([superAdminUser], { session });
      if (!user.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Faild to create a super admin user"
        );
      }
      // set user reference to the admin data
      superAdminData.user = user[0]._id;
      const admin = await Admin.create([superAdminData], { session });
      if (!admin.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Faild to create a super admin data"
        );
      }

      await session.commitTransaction();
      await session.endSession();

      console.log("Super Admin is created successfully");
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Faild to create a super admin"
      );
    }
  }
};

export default seedSuperAdmin;
