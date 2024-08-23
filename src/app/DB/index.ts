import { USER_ROLE } from "../../modules/user/user.constant";
import { User } from "../../modules/user/user.model";
import config from "../config";

// static superAdmin data.
const superAdminUser = {
  id: "0001",
  email: "superadmin@gmail.com",
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  isDeleted: false,
};

/**
 * if superAdmin doesn't exist in database, it created a super admin when database is connected
 */
const seedSuperAdmin = async () => {
  // when database is connected, we will check is there any user who is super admin
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!isSuperAdminExists) {
    await User.create(superAdminUser);
  }
};

export default seedSuperAdmin;
