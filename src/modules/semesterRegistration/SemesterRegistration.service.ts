import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { Semester } from "../academicSemester/semester.model";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builders/QueryBuilder";
import { registrationStatus } from "./semesterRegistration.constants";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import mongoose from "mongoose";

// ---------- create a new Semester Registration service ----------
const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration
) => {
  // check if there any registered semester that is already 'UPCOMMING' or 'ONGOING'
  const currentSemesterRegistrationStatus = await SemesterRegistration.findOne({
    $or: [{ status: "UPCOMMING" }, { status: "ONGOING" }],
  });
  if (currentSemesterRegistrationStatus) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `already there is a ${currentSemesterRegistrationStatus.status} registered semester`
    );
  }

  // check if academic semester is exist
  if (!(await Semester.isSemesterExists(String(payload.academicSemester)))) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester not found");
  }

  // check if semester registration already exists
  const res = await SemesterRegistration.isSemesterRegistrationExists(
    payload.academicSemester
  );
  if (res) {
    throw new AppError(
      httpStatus.CONFLICT,
      "semester registration already exists"
    );
  }

  // don't create new semester registration, if
  // create new semester registration
  const result = await SemesterRegistration.create(payload);
  return result;
};

// ---------- get all semesters registrations service ----------
const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate("academicSemester"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

// ---------- get a semester registration ----------
const getSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

// ---------- update a semester registration ----------
const updateSemesterRegistrationIntoDB = async (
  id: any,
  payload: Partial<TSemesterRegistration>
) => {
  // check if semester registration exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "this semester registration is not found !"
    );
  }

  const currentSemesterStatus = isSemesterRegistrationExists.status;
  // check if semester registration is already 'ENDED', we will not update
  if (currentSemesterStatus === registrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "this semester registration already ENDED"
    );
  }

  // upcomming ----- ongoing ------- ended.
  // possible status changes
  // upcoming ----- ongoing
  // ongoing ----- ended
  if (payload?.status) {
    if (
      (currentSemesterStatus === registrationStatus.UPCOMING &&
        payload.status === registrationStatus.ONGOING) ||
      (currentSemesterStatus === registrationStatus.ONGOING &&
        payload.status === registrationStatus.ENDED)
    ) {
      const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
      });
      return result;
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `you can not change status directly ${currentSemesterStatus} to ${payload?.status}`
      );
    }
  } else {
    const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return result;
  }
};

// ---------- delete semester registration ----------
// const deleteSemesterRegistrationFromDB = async (id: string) => {
//   // check if the semester registration exists
//   if (!(await SemesterRegistration.findById(id))) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "Semester registration is not found!"
//     );
//   }

//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     // delete the semester registration
//     const deletedSemesterRegistration =
//       await SemesterRegistration.findByIdAndDelete(id, { new: true, session });
//     if (!deletedSemesterRegistration) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Semester registration is failed to delete!"
//       );
//     }

//     // delete the offered courses belong to this semester registration
//     const deletedOfferedCourse = await OfferedCourse.findByIdAndDelete(id, {
//       new: true,
//       session,
//     });
//     if (!deletedOfferedCourse) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "offered course is failed to delete!"
//       );
//     }

//     await session.endSession();
//     await session.commitTransaction();

//     // const result = await SemesterRegistration.findByIdAndDelete(id);
//     // return result;
//     return null;
//   } catch (error) {
//     await session.endSession();
//     await session.abortTransaction();
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "offered course and semester registration are failed to delete!"
//     );
//   }
// };

// without transaction
const deleteSemesterRegistrationFromDB = async (id: string) => {
  // check if the semester registration exists
  if (!(await SemesterRegistration.findById(id))) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester registration is not found!"
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // delete the semester registration
    const deletedSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, { new: true, session });
    if (!deletedSemesterRegistration) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Semester registration is failed to delete!"
      );
    }

    // delete the offered courses belong to this semester registration
    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      { session }
    );

    await session.endSession();
    await session.commitTransaction();
    return deletedSemesterRegistration;
  } catch (error) {
    await session.endSession();
    await session.abortTransaction();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Faild to delete semester registration and offered courses"
    );
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
