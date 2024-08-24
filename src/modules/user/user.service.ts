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

  if (file) {
    // send image to cloudinary
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

// TODO: uncomment this, and rmeove below method.
// create faculty into db
// const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
//   // create a user data object
//   const userData: Partial<TUser> = {};

//   // if password is not provided, use default password
//   userData.password = password || (config.default_password as string);

//   // set user role
//   userData.role = "faculty";

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();
//     // set generated id
//     userData.id = await userUtils.generateFacultyId();

//     // create a new user: (transaction-1)
//     const newUser = await User.create([userData], { session });

//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
//     }
//     // set id, _id as user
//     payload.id = newUser[0].id;
//     payload.user = newUser[0]._id; // reference id

//     // create a faculty (transaction-2)
//     const newFaculty = await Faculty.create([payload], { session });

//     if (!newFaculty.length) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Faild to create a new Faculty in second transaction"
//       );
//     }

//     await session.commitTransaction();
//     await session.endSession();

//     return newFaculty[0];
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "faild to create a new faculty in rollback"
//     );
//   }
// };

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  // create a user data object
  const userData: Partial<TUser> = {};

  // if password is not provided, use default password
  userData.password = password || (config.default_password as string);

  // set user role and user email
  userData.role = "faculty";
  userData.email = payload.email;

  // set generated id
  userData.id = await userUtils.generateFacultyId();

  if (file) {
    // send image to cloudinary
    const imageName = `${userData.id}-${payload.name.firstName}`;
    const path = file?.path;
    const profileImage: any = await sendImageToCloudinary(imageName, path);

    // set profileImg
    payload.profileImg = profileImage.secure_url;
  }

  // create a new user: (transaction-1)
  const newUser = await User.create(userData);

  if (!newUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
  }
  // set id, _id as user
  payload.id = newUser.id;
  payload.user = newUser._id; // reference id

  // create a faculty (transaction-2)
  const newFaculty = await Faculty.create(payload);

  if (!newFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faild to create a new Faculty in second transaction"
    );
  }

  return newFaculty;
};

// TODO: uncomment this, and remove below method.
// create admin into db
// const createAdminIntoDB = async (password: string, payload: TAdmin) => {
//   // create a user data object
//   const userData: Partial<TUser> = {};

//   // if password is not provided, use default password
//   userData.password = password || (config.default_password as string);

//   // set user role
//   userData.role = "admin";

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();
//     // set generated id
//     userData.id = await userUtils.generateAdminId();

//     // create a new user: (transaction-1)
//     const newUser = await User.create([userData], { session });

//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
//     }
//     // set id, _id as user
//     payload.id = newUser[0].id;
//     payload.user = newUser[0]._id; // reference id

//     // create a Admin (transaction-2)
//     const newAdmin = await Admin.create([payload], { session });

//     if (!newAdmin.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new admin");
//     }

//     await session.commitTransaction();
//     await session.endSession();

//     return newAdmin[0];
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "faild to create a new admin in rollback"
//     );
//   }
// };

// temporary without transaction
// create admin into db
const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin
) => {
  // create a user data object
  const userData: Partial<TUser> = {};

  // if password is not provided, use default password
  userData.password = password || (config.default_password as string);

  // set user role and user email
  userData.role = "admin";
  userData.email = payload.email;

  // set generated id
  userData.id = await userUtils.generateAdminId();

  if (file) {
    // send image to cloudinary
    const imageName = `${userData.id}-${payload.name.firstName}`;
    const path = file?.path;
    const profileImage: any = await sendImageToCloudinary(imageName, path);

    // set profileImg
    payload.profileImg = profileImage.secure_url;
  }

  // create a new user: (transaction-1)
  const newUser = await User.create(userData);

  if (!newUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new user");
  }
  // set id, _id as user
  payload.id = newUser.id;
  payload.user = newUser._id; // reference id

  // create a Admin (transaction-2)
  const newAdmin = await Admin.create(payload);

  if (!newAdmin) {
    throw new AppError(httpStatus.BAD_REQUEST, "Faild to create a new admin");
  }
  return newAdmin;
};

// -------------------- getMe --------------------
const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === USER_ROLE.student) {
    result = await Student.findOne({ id: userId }).populate("user");
  }
  if (role === USER_ROLE.faculty) {
    result = await Faculty.findOne({ id: userId }).populate("user");
  }
  if (role === USER_ROLE.admin) {
    result = await Admin.findOne({ id: userId }).populate("user");
  }

  return result;
};

// -------------------- changeUserStatus --------------------
const changeUserStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { newUser: true });

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeUserStatus,
};
