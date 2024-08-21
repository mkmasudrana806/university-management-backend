import mongoose from "mongoose";

import AppError from "../../utils/appError";
import httpStatus from "http-status";
import { User } from "../user/user.model";

import QueryBuilder from "../../builders/QueryBuilder";
import Faculty from "./faculty.model";
import { facultySearchableFields } from "./faculty.constant";
import { TFaculty } from "./faculty.interface";

// get all faculties from DB
const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate("academicDepartment"),
    query
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();

  const result = await facultyQuery.modelQuery;
  return result;
};

// get a single faculty
const getAFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate("academicDepartment");
  return result;
};

// delete a single faculty
const deleteAFacultyFromDB = async (id: string) => {
  const userExists = await Faculty.isFacultyExists(id);
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "user doesn't exists");
  }
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // delete a faculty from Faculty collection (transaction-1)
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Faculty");
    }

    // delete a faculty from User collection (transaction-2)
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    // commit the transaction
    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (error) {
    // abort the transaction
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete a faculty");
  }
};

// update a faculty into DB
const updateAFacultyFromDB = async (id: string, payload: Partial<TFaculty>) => {
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
  const result = await Faculty.findByIdAndUpdate(
    id,
    { $set: flattenedPayload },
    { new: true, runValidators: true }
  );
  return result;
};

// export all the services
export const facultyServices = {
  getAllFacultiesFromDB,
  getAFacultyFromDB,
  deleteAFacultyFromDB,
  updateAFacultyFromDB,
};
