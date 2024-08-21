import mongoose from "mongoose";

import AppError from "../../utils/appError";
import httpStatus from "http-status";
import { User } from "../user/user.model";

import QueryBuilder from "../../builders/QueryBuilder";
import Admin from "./admin.model";
import { adminSearchableFields } from "./admin.constant";
import { TAdmin } from "./admin.interface";

// get all admins from DB
const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(
    Admin.find().populate("managementDepartment"),
    query
  )
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();

  const result = await adminQuery.modelQuery;
  return result;
};

// get a single admin
const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id).populate("managementDepartment");
  return result;
};

// delete a single faculty
const deleteSingleAdminFromDB = async (id: string) => {
  const userExists = await Admin.isUserExists(id);
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "user doesn't exists");
  }
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    // delete an admin from Admin collection (transaction-1)
    const deleteFaculty = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
    }

    // delete an admin from User collection (transaction-2)
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
    return deleteFaculty;
  } catch (error) {
    // abort the transaction
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete an admin");
  }
};

// update an admin into DB
const updateSingleAdminFromDB = async (
  id: string,
  payload: Partial<TAdmin>
) => {
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
  const result = await Admin.findByIdAndUpdate(
    id,
    { $set: flattenedPayload },
    { new: true, runValidators: true }
  );
  return result;
};

// export all the services
export const adminServices = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  deleteSingleAdminFromDB,
  updateSingleAdminFromDB,
};
