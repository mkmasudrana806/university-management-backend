import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { SemesterNameCodeMapper } from "./semester.constant";
import { TAcademicSemester } from "./semester.interface";
import { Semester } from "./semester.model";

// create a new Semester service
const createSemesterIntoDB = async (payload: TAcademicSemester) => {
  // check semester name - code pair correctness
  if (SemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid semester name and code");
  }
  const result = await Semester.create(payload);
  return result;
};

// get all semesters service
const getAllSemesterFromDB = async () => {
  const result = await Semester.find({});
  return result;
};

// get a semester
const getSingleSemesterFromDB = async (semesterId: string) => {
  const result = await Semester.findById(semesterId);
  return result;
};

// update a semester
const updateSingleSemesterFromDB = async (
  semesterId: string,
  payload: Partial<TAcademicSemester>
) => {
  if (
    payload.name &&
    payload.code &&
    SemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Semester Code");
  }
  const result = await Semester.findOneAndUpdate({ _id: semesterId }, payload, {
    new: true,
  });
  return result;
};

export const SemesterServices = {
  createSemesterIntoDB,
  getAllSemesterFromDB,
  getSingleSemesterFromDB,
  updateSingleSemesterFromDB,
};
