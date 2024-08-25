import mongoose from "mongoose";
import Student from "./student.model";
import AppError from "../../utils/appError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builders/QueryBuilder";
import { allowedFields, studentSearchableFields } from "./student.constant";
import makeFlattenedObject from "../../utils/makeFlattenedObject";
import allowedUpdatedData from "../../utils/allowedUpdatedData";
import { Semester } from "../academicSemester/semester.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";

/**
 * -------------------- get all student from DB --------------------
 *
 * @param query req.query object
 * @features functionality to search, filter, sort, pagination, fieldsLimiting and count total meta data and populated with user, admissionSemester and academicDepartment
 * @example in query, searchTerm=atel&email=masud@gmail.com&sort=name&fields=name,email,phone,address&page=2&limit=20 or any of them.
 * @returns return all students and meta data
 */
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find().populate("user").populate("admissionSemester").populate({
      path: "academicDepartment",
    }),
    query
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();

  const metaData = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;
  return { metaData, result };
};

/**
 * -------------------- get a single student --------------------
 *
 * @param id student id (mongodb id)
 * @returns return found result
 */
const getAStudentFromDB = async (id: string) => {
  const result = await Student.findById(id)
    .populate("user")
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

/**
 * -------------------- delete a single student --------------------
 *
 * @param id mongodb id
 * @features transaction is used to maintain consistency
 * @returns return deleted student data
 */
const deleteAStudentFromDB = async (id: string) => {
  const userExists = await Student.isUserExists(id);
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "user doesn't exists");
  }
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // delete a student from Student collection (transaction-1)
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
    }

    // delete an user from User collection (transaction-2)
    const deletedUser = await User.findByIdAndUpdate(
      deletedStudent.user,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    // commit the transaction
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    // abort the transaction
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
  }
};

/**
 * -------------------- update a student into DB --------------------
 *
 * @param id student id ( mongodb id )
 * @param payload updated student data
 * @validations check user, academicDepartment, admissionSemester exists
 * @features update only allowed fields, skip others fields even provided to update
 * @returns return updated student data
 */

const updateAStudentFromDB = async (id: string, payload: Partial<TStudent>) => {
  // check user exists, and not blocked
  const user: any = await Student.findById(id).populate("user");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exists!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }
  if (user?.user?.status === "blocked") {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already Blocked!");
  }

  // make new object to update student data
  const updatedData = allowedUpdatedData<TStudent>(allowedFields, payload);

  // check admission semester exists
  if (payload?.admissionSemester) {
    const admissionSemester = await Semester.findById(
      payload.admissionSemester
    );
    if (!admissionSemester) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Admission semester is not found!"
      );
    }
  }

  // check academicDepartment semester exists
  if (payload?.academicDepartment) {
    const academicDepartment = await AcademicDepartment.findById(
      payload.academicDepartment
    );
    if (!academicDepartment) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Academic Department is not found!"
      );
    }
    // set academic faculty dynamically
    payload.academicFaculty = academicDepartment.academicFaculty;
  }

  // make any non-primary object to flattened object
  const flattenedPayload = makeFlattenedObject(updatedData);
  const result = await Student.findByIdAndUpdate(
    id,
    { $set: flattenedPayload },
    { new: true, runValidators: true }
  );
  return result;
};

// export all the services
export const studentServices = {
  getAllStudentsFromDB,
  getAStudentFromDB,
  deleteAStudentFromDB,
  updateAStudentFromDB,
};
