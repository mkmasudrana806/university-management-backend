import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { Semester } from "../academicSemester/semester.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../courses/course.model";
import Faculty from "../faculty/faculty.model";
import { hasTimeConflict } from "./offeredCourse.utils";
import Student from "../student/student.model";

// ---------- create a new orffered course ----------
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  // check if semester registration exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "No semester registration found");
  }

  // check if academic semester exists
  const isSemesterExists = await Semester.findById(
    isSemesterRegistrationExists.academicSemester
  );
  if (!isSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester is not found");
  }
  payload.academicSemester = isSemesterRegistrationExists.academicSemester;

  // check if academic faculty is exists
  const isAcademicFacultyExists = await AcademicFaculty.findById(
    academicFaculty
  );
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic faculty is not found");
  }

  // check if academic department is exists
  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    academicDepartment
  );
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Academic department is not found"
    );
  }

  // check if academic department is belong to academic faculty
  const academicDepartmentId = JSON.stringify(
    isAcademicDepartmentExists.academicFaculty
  );
  const academicFacultyId = JSON.stringify(isAcademicFacultyExists._id);
  if (academicDepartmentId !== academicFacultyId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `this Department of ${isAcademicDepartmentExists.name} is not belong to ${isAcademicFacultyExists.name}`
    );
  }

  // check if course is exists
  if (!(await Course.findById(course))) {
    throw new AppError(httpStatus.NOT_FOUND, "Course is not found");
  }

  // check if faculty is exists
  if (!(await Faculty.findById(faculty))) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty is not found");
  }

  // check if the same offered course exist in same section and same registered semester
  const isExistsSameOfferedCourse = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });
  if (isExistsSameOfferedCourse) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Same section is already exists!, Same course with same registered semester is not possible to offer same section"
    );
  }

  // check if the new faculty already take a course with the same time
  // retrived offered courses for this new faculty with same registered section
  const assignedSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = { days, startTime, endTime };

  if (hasTimeConflict(assignedSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at ${startTime} - ${endTime} on ${days}, choose other time or day`
    );
  }

  const result = await OfferedCourse.create(payload);
  return result;
};

// ---------- get all offered coruses ----------
const getAllOfferedCoursesFromDB = async () => {
  const result = await OfferedCourse.find({});
  return result;
};

// ---------- get my offered coruses ----------
const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  // find student
  const currentStudent = await Student.findOne({ id: userId });
  if (!currentStudent) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }

  // find current ongoing semester
  const currentOngoingSemester = await SemesterRegistration.findOne({
    status: "ONGOING",
  });

  // pagination setup
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  // find current semester specific department offered courses
  const result = await OfferedCourse.aggregate([
    {
      $match: {
        semesterRegistration: currentOngoingSemester?._id,
        academicDepartment: currentStudent.academicDepartment,
      },
    },
    // lookup into courses
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    // lookup into enrolledcourses to find enrolledCourses
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentOngoingSemester: currentOngoingSemester?._id,
          currentStudentId: currentStudent._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$semesterRegistration", "$$currentOngoingSemester"],
                  },
                  {
                    $eq: ["$student", "$$currentStudentId"],
                  },
                  {
                    $eq: ["$isEnrolled", true],
                  },
                ],
              },
            },
          },
        ],
        as: "enrolledCourses",
      },
    },
    // lookup into enrolledcourses to find completedCourses
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentStudentId: currentStudent._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$student", "$$currentStudentId"],
                  },
                  {
                    $eq: ["$isCompleted", true],
                  },
                ],
              },
            },
          },
        ],
        as: "completedCourses",
      },
    },
    // add field: completed courss ids
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: "$completedCourses",
            as: "completed",
            in: "$$completed.course",
          },
        },
      },
    },
    // add fields isAlreadyEnrolled and isPreRequisiteFulFilled
    {
      $addFields: {
        isPreRequisiteFulFilled: {
          $or: [
            {
              $eq: ["$course.preRequisiteCourses", []],
            },
            {
              $setIsSubset: [
                "$course.preRequisiteCourses.course",
                "$completedCourseIds",
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            "$course._id",
            {
              $map: {
                input: "$enrolledCourses", // on which want to run loop
                as: "enroll", // callback variable
                in: "$$enroll.course",
              },
            },
          ],
        },
      },
    },
    // match
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisiteFulFilled: true,
      },
    },
    // project
    {
      $project: {
        enrolledCourses: 0,
        completedCourses: 0,
      },
    },
    // skip
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const total = result.length ? skip : 0 + result.length;
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};

// ---------- get an offered course ----------
const getOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

// ---------- delete an offered course ----------
const deleteOfferedCourseFromDB = async (id: string) => {
  // check if offered course exists
  const isOfferedCourseExists = await OfferedCourse.isOfferedCourseExists(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course is not found!");
  }

  // delete offered course, only if semester registration status is 'UPCOMING'
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration
  ).select("status");
  if (semesterRegistration?.status !== "UPCOMING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not delete this offered course, because the semester registration is '${semesterRegistration?.status}'`
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};

// ---------- update an offered course ----------
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<
    TOfferedCourse,
    "faculty" | "days" | "maxCapacity" | "startTime" | "endTime"
  >
) => {
  const { faculty, days, startTime, endTime } = payload;

  // check if offered course exists
  const isOfferedCourseExists = await OfferedCourse.isOfferedCourseExists(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course is not found!");
  }

  // check if faculty is exists
  if (!(await Faculty.isFacultyExists(String(faculty)))) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty is not found!");
  }

  // check if semester registration status 'UPCOMING'. else throw new AppError
  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (semesterRegistrationStatus?.status !== "UPCOMING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `you can not update this offered course, as it is already ${semesterRegistrationStatus?.status}`
    );
  }

  // check time comflict
  // check if the new faculty already take a course with the same time
  // retrived offered courses for this new faculty with same registered section
  const assignedSchedule = await OfferedCourse.find({
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = { days, startTime, endTime };

  if (hasTimeConflict(assignedSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available at ${startTime} - ${endTime} on ${days}, choose other time or day`
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  getMyOfferedCoursesFromDB,
};
