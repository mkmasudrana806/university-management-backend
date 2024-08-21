import mongoose from "mongoose";
import QueryBuilder from "../../builders/QueryBuilder";
import { courseSearchableFields } from "./course.constants";
import { Course, CourseFaculty } from "./course.model";
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCoures,
} from "./courses.interface";
import AppError from "../../utils/appError";
import httpStatus from "http-status";

// ------------------- create a course -------------------
const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

// ------------------- get all courses -------------------
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate("preRequisiteCourses.course"),
    query
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();
  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();
  console.log(meta);
  return result;
};

// ------------------- get single course -------------------
const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    "preRequisiteCoures.course"
  );
  return result;
};

// ------------------- delete course -------------------
const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

// ------------------- update course -------------------
// with transaction
// const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
//   // filter out normal property and pre requisite courses
//   const { preRequisiteCourses, ...normalProperties } = payload;

//   let result;
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     // handle pre requisite courses logic
//     if (preRequisiteCourses) {
//       const addCourses: any[] = [];
//       const removeCourses: any[] = [];

//       preRequisiteCourses.forEach((course: any) => {
//         if (course.isDeleted) {
//           removeCourses.push(course.course);
//         } else {
//           addCourses.push(course);
//         }
//       });

//       // update add courses
//       if (addCourses.length > 0) {
//         result = await Course.findByIdAndUpdate(
//           id,
//           { $push: { preRequisiteCourses: { $each: addCourses } } },
//           { new: true, session }
//         );
//         if (!result) {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             "Faild to add new courses"
//           );
//         }
//       }

//       // update remove courses
//       if (removeCourses.length > 0) {
//         result = await Course.findByIdAndUpdate(
//           id,
//           {
//             $pull: {
//               preRequisiteCourses: {
//                 course: { $in: removeCourses },
//               },
//             },
//           },
//           { new: true, session }
//         );
//         if (!result) {
//           throw new AppError(httpStatus.BAD_REQUEST, "Faild to remove courses");
//         }
//       }
//     }

//     // update normal properties
//     if (Object.entries(normalProperties).length > 0) {
//       result = await Course.findByIdAndUpdate(id, normalProperties, {
//         new: true,
//         session,
//       });
//       if (!result) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Faild to update courses");
//       }
//     }

//     await session.commitTransaction();
//     await session.endSession();
//     return result;

//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(httpStatus.BAD_REQUEST, "Faild to update courses");
//   }
// };

// without transaction
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  // filter out normal property and pre requisite courses
  const { preRequisiteCourses, ...normalProperties } = payload;

  console.log(preRequisiteCourses, normalProperties);
  let result;
  // handle pre requisite courses logic
  if (preRequisiteCourses) {
    const addCourses: any[] = [];
    const removeCourses: any[] = [];

    preRequisiteCourses.forEach((course: any) => {
      if (course.isDeleted) {
        removeCourses.push(course.course);
      } else {
        addCourses.push(course);
      }
    });

    // update add courses
    if (addCourses.length > 0) {
      result = await Course.findByIdAndUpdate(
        id,
        { $addToSet: { preRequisiteCourses: { $each: addCourses } } },
        { new: true }
      );

      console.log("add courses updated", addCourses);
    }

    // update remove courses
    if (removeCourses.length > 0) {
      result = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: removeCourses },
            },
          },
        },
        { new: true }
      );
      console.log("remove courses updated", removeCourses);
    }
  }

  // update normal properties
  if (Object.entries(normalProperties).length > 0) {
    result = await Course.findByIdAndUpdate(id, normalProperties, {
      new: true,
    });
  }

  return result;
};

// ----------------- assign faculties to a course ------------------------
const assignFacultiesToCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: {
        faculties: { $each: payload },
      },
    },
    { upsert: true, new: true }
  );

  return result;
};

// ----------------- remove faculties from a course ------------------------
const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    { new: true }
  );

  return result;
};

// ----------------- get faculties for a course ------------------------
const getFacultiesWithCourseFromDB = async (courseId: string) => {
  const result = await CourseFaculty.findOne({ course: courseId }).populate(
    "faculties"
  );

  return result;
};
export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesToCourseIntoDB,
  removeFacultiesFromCourseFromDB,
  getFacultiesWithCourseFromDB,
};
