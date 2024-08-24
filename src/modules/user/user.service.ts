import config from "../../app/config";
import { TAcademicSemester } from "../academicSemester/semester.interface";
import { Semester } from "../academicSemester/semester.model";
import { TStudent } from "../student/student.interface";
import Student from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { userUtils } from "./user.utils";
import AppError from "../../utils/appError";
import httpStatus from "http-status";
import { TFaculty } from "../faculty/faculty.interface";
import Faculty from "../faculty/faculty.model";
import { TAdmin } from "../admin/admin.interface";
import Admin from "../admin/admin.model";
import { USER_ROLE } from "./user.constant";
import sendImageToCloudinary from "../../utils/sendImageToCloudinary";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import mongoose from "mongoose";

/**
 * create a student into db
 *
 * @param file image file from client
 * @param password new student password
 * @param payload new student data
 * @validations check semester, academic department exists.
 * @features abort transaction if it faild to create a student or an user otherwise commit it
 * @features dynamically handle user data in backend
 * @returns newly created student data
 */
const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  const userData: Partial<TUser> = {};

  // check if the email address already exists
  const isEmailExists = await User.findOne({ email: payload?.email });
  if (isEmailExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${payload.email} is already exists`
    );
  }

  // set default password, role and email address
  userData.password = password || (config.default_password as string);
  userData.role = "student";
  userData.email = payload.email;

  // find semester information
  const admissionSemester = (await Semester.findById(
    payload.admissionSemester
  )) as TAcademicSemester;
  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, "Admission Semester not found");
  }

  // find academic department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Department not found");
  }
  // set academicFaculty data
  payload.academicFaculty = academicDepartment.academicFaculty;
  // set generated id
  userData.id = await userUtils.generateStudentId(admissionSemester);

  // send image to cloudinary and set profileImg as cloudinary secure_url
  if (file) {
    const imageName = `${userData.id}-${payload.name.firstName}`;
    const path = file?.path;
    const profileImage: any = await sendImageToCloudinary(imageName, path);
    payload.profileImg = profileImage.secure_url;
  }

  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // create a new user: (transaction-1)
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // user reference to student data

    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Faild to create a new student"
      );
    }

    // commit the transaction
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Faild to create a student and uesr"
    );
  }
};

/**
 * create a faculty into db
 *
 * @param file image file from client
 * @param password new faculty password
 * @param payload new faculty data
 * @features dynamically handle user data in backend
 * @features abort transaction if it faild to create a faculty or an user otherwise commit it
 * @returns newly created faculty data
 */
const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  // create a user data object
  const userData: Partial<TUser> = {};

  // check if the email address already exists
  const isEmailExists = await User.findOne({ email: payload?.email });
  if (isEmailExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${payload.email} is already exists`
    );
  }
  // set default password, role, email and generated id
  userData.password = password || (config.default_password as string);
  userData.role = "faculty";
  userData.email = payload.email;
  // set generated id
  userData.id = await userUtils.generateFacultyId();

  // send image to cloudinary and set profileImg as cloudinary secure_url
  if (file) {
    const imageName = `${userData.id}-${payload.name.firstName}`;
    const path = file?.path;
    const profileImage: any = await sendImageToCloudinary(imageName, path);
    payload.profileImg = profileImage.secure_url;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // create a new user: (transaction-1)
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference id to user

    // create a faculty (transaction-2)
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Faild to create a new Faculty in second transaction"
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a faculty");
  }
};

/**
 * create an admin into db
 *
 * @param file image file from client
 * @param password new admin password
 * @param payload new admin data
 * @features dynamically handle user data in backend
 * @features abort transaction if it faild to create an admin or an user otherwise commit it
 * @returns newly created faculty data
 */

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin
) => {
  // create a user data object
  const userData: Partial<TUser> = {};

  // check if the email address already exists
  const isEmailExists = await User.findOne({ email: payload?.email });
  if (isEmailExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${payload.email} is already exists`
    );
  }

  // set default password, role, email and generated id
  userData.password = password || (config.default_password as string);
  userData.role = "admin";
  userData.email = payload.email;
  userData.id = await userUtils.generateAdminId();

  // send image to cloudinary and set profileImg as cloudinary secure_url
  if (file) {
    const imageName = `${userData.id}-${payload.name.firstName}`;
    const path = file?.path;
    const profileImage: any = await sendImageToCloudinary(imageName, path);
    payload.profileImg = profileImage.secure_url;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // create a new user: (transaction-1)
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // add reference to user property

    // create an Admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new admin");
    }

    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Faild to create an admin");
  }
};

/**
 * -------------------- getMe --------------------
 *
 * @param userId custom user id
 * @param role user role like 'student' or 'admin' or 'faculty' or 'superAdmin'
 * @returns base on role, return that user data
 */
const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === USER_ROLE.student) {
    result = await Student.findOne({ id: userId }).populate("user");
  } else if (role === USER_ROLE.faculty) {
    result = await Faculty.findOne({ id: userId }).populate("user");
  } else if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
    result = await Admin.findOne({ id: userId }).populate("user");
  }
  return result;
};

/**
 *  -------------------- changeUserStatus --------------------
 *
 * @param currentAdminRole it can be superAdmin or admin
 * @param id user id (mongodb _id)
 * @param payload user status like 'in-progress' or 'blocked
 * @validation check user exists, or deleted, or is already blocked
 * @features superAdmin can change anyone status except ownself. admin can change faculty and student status except ownself.
 * @returns return updated user
 */

const changeUserStatus = async (
  currentAdminRole: string,
  id: string,
  payload: { status: string }
) => {
  // check if user exists
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // check if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }

  // check user status
  if (user?.status === "blocked") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Requested user is already blocked!"
    );
  }

  // allow superAdmin to change status of a student, faculty, and admin. ownself is not allowed
  if (
    currentAdminRole === USER_ROLE.superAdmin &&
    user.role === USER_ROLE.superAdmin
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "As a superAdmin, You can not change ownself status"
    );
  }
  // allow admin to change status of student and faculty. ownself is not allowed
  if (
    (currentAdminRole === USER_ROLE.admin &&
      user.role === USER_ROLE.superAdmin) ||
    (currentAdminRole === USER_ROLE.admin && user.role === USER_ROLE.admin)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Admin can't change another admin or superAdmin status!"
    );
  }

  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeUserStatus,
};
