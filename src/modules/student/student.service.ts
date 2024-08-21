import mongoose from "mongoose";
import Student from "./student.model";
import AppError from "../../utils/appError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builders/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

// -------------------- get all student from DB --------------------
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query }; // copied query object
  // let searchTerm = "";
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // // { email: { $regex: query.searchTerm, $options: i} }
  // // { presentAddress: { $regex: query.searchTerm, $options } }
  // // { 'name.firstName': { $regex: query.searchTerm, $options } }
  // // partial matching
  // const searchQuery = Student.find({
  //   $or: ["email", "name.firstName", "presentAddress"].map((field) => ({
  //     [field]: { $regex: searchTerm, $options: "i" },
  //   })),
  // });

  // // filtering
  // const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // console.log({ query }, { queryObj });

  // const filterQuery = searchQuery.find(queryObj);

  // // sorting
  // let sort = "-createdAt";
  // if (query.sort) {
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // limiting and pagging
  // let page = 1;
  // let limit = 1;
  // let skip = 0;

  // if (query.limit) {
  //   limit = Number(query.limit);
  // }

  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }

  // // paginate query
  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // field limiting
  // let fields = "-__v";
  // fields: 'name, email'
  // convert: fields: 'name email' space seperated
  // if (query.fields) {
  //   fields = (query.fields as string).split(",").join(" ");
  // }

  // const fieldsQuery = await limitQuery.select(fields);

  // return fieldsQuery;
  const studentQuery = new QueryBuilder(
    Student.find()
      .populate("user")
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      }),
    query
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();

  const result = await studentQuery.modelQuery;
  return result;
};

// -------------------- get a single student --------------------
// use populate, and nested populate
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

// -------------------- delete a single student --------------------
const deleteAStudentFromDB = async (id: string) => {
  const userExists = await Student.isUserExists(id);
  // if (!userExists) {
  //   throw new AppError(httpStatus.NOT_FOUND, "user doesn't exists");
  // }
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // delete a student from DB (transaction-1)
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
    }

    // delete a user from DB (transaction-2)
    const deletedUser = await User.findOneAndUpdate(
      { id },
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

// -------------------- update a student into DB --------------------
const updateAStudentFromDB = async (id: string, payload: Partial<TStudent>) => {
  // recursive function to make key/value pairs object
  const flattenObject = (
    obj: { [key: string]: any },
    parentKey: string = "",
    result: { [key: string]: any } = {}
  ): { [key: string]: any } => {
    for (const key in obj) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        !Array.isArray(obj[key]) &&
        obj[key] !== null
      ) {
        flattenObject(obj[key], fullKey, result);
      } else {
        result[fullKey] = obj[key];
      }
    }
    return result;
  };

  const flattenedPayload = flattenObject(payload);
  const result = await Student.findOneAndUpdate(
    { id },
    { $set: flattenedPayload },
    { new: true }
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
