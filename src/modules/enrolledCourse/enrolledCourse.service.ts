import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import Student from "../student/student.model";
import { Types } from "mongoose";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import Faculty from "../faculty/faculty.model";
import makeFlattenedObject from "../../utils/makeFlattenedObject";
import calculateGradePoints from "./enrolledCourse.utils";
import QueryBuilder from "../../builders/QueryBuilder";
import { populate } from "dotenv";

/**
 * ---------------------- enrolled a course into db--------------------
 *
 * @param userId currently logged in custom user id: 2024032001
 * @param payload offeredCourse id to enroll a course
 * @validations check offered course exists and the student already enrolled for this course
 * @validations check offered course doesn't exceeded it's maxCapacity
 * @validations student enrollment of courses dont' exceeded semester max credits
 * @validations before decrement maxCapacity of this course, atomic check if maxCapacity greater than 0
 */
// TODO: use transaction. currently mongo compass, for this i am not using a transaction
const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse
) => {
  const { offeredCourse } = payload;

  // check if offered course exists. include fields are required
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
    .populate({
      path: "semesterRegistration",
      select: "maxCredit",
    })
    .populate({
      path: "course",
      select: "credits",
    })
    .select(
      "academicSemester academicDepartment academicFaculty faculty maxCapacity"
    );

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course not found");
  }

  // semester registration and course type assertion of populated fields
  const semesterRegistration =
    isOfferedCourseExists.semesterRegistration as unknown as {
      maxCredit: number;
      _id: Types.ObjectId;
    };
  const course = isOfferedCourseExists.course as unknown as {
    credits: number;
    _id: Types.ObjectId;
  };

  // check if the maxCapacity of offered courses not exceeded
  if (isOfferedCourseExists.maxCapacity === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Room is full");
  }

  // check if the stuent is already registered for this course
  const student = await Student.findOne({ id: userId }, { _id: 1 });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }

  const isAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student?._id,
  });

  if (isAlreadyEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Student is already enrolled for this course"
    );
  }

  // find out  enrolled courses total credits
  const takenCourseCredits = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: semesterRegistration?._id,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseDetails",
      },
    },
    {
      $unwind: "$courseDetails",
    },
    {
      $group: {
        _id: "$student",
        takenCredits: { $sum: "$courseDetails.credits" },
      },
    },
  ]);

  // check totalCredits don't exceed this semester maxCredit
  const totalCredits = takenCourseCredits[0].takenCredits + course?.credits;
  if (totalCredits > semesterRegistration.maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your have reached maximum credits limits"
    );
  }

  // fill up the payload
  payload.semesterRegistration = semesterRegistration._id;
  payload.academicSemester = isOfferedCourseExists.academicSemester;
  payload.academicFaculty = isOfferedCourseExists.academicFaculty;
  payload.academicDepartment = isOfferedCourseExists.academicDepartment;
  payload.offeredCourse = offeredCourse;
  payload.course = course._id;
  payload.student = student._id;
  payload.faculty = isOfferedCourseExists.faculty;

  // note: before enrolled a course, again run atomic operation at find stage that maxCapacity greater than 0
  // decrement maxCapacity of an offered course
  const updatedOfferedCourse = await OfferedCourse.findOneAndUpdate(
    { _id: offeredCourse, maxCapacity: { $gt: 0 } },
    { $inc: { maxCapacity: -1 } },
    { new: true }
  );

  if (!updatedOfferedCourse) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faild to enroll this course, max capacity exceeded it's limit"
    );
  }

  // enrolled the course
  const result = await EnrolledCourse.create(payload);

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Faild to enrolled to this course"
    );
  }

  return result;
};

/**
 * ---------------------- enrolled a course into db--------------------
 *
 * @param userId faculty custom id: F-0001
 * @param payload updated payload data
 * @validations check if semesterRegistration, offeredCourse, student, faculty exists
 * @validations check if faculty belongs to this course
 */
const updateEnrolledCourseMarksIntoDB = async (
  userId: string,
  payload: Partial<TEnrolledCourse>
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  // check if semester registration exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester Registration is not found"
    );
  }

  // check if offered course exists
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered Course is not found");
  }

  // check if student exists
  const isStudentExists = await Student.findById(student);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Student is not found");
  }

  // check if faculty exists
  const isFacultyExists = await Faculty.findOne({ id: userId });
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty is not found");
  }

  // check if the offered course belong to the faculty
  const isFacultyBelongToCourse = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: isFacultyExists._id,
  }).lean();

  if (!isFacultyBelongToCourse) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden");
  }

  let flattenedData: Record<string, unknown> = {};
  let totalMarks = 0;

  // dynamically update the enrolledCourse marks
  if (courseMarks && Object.keys(courseMarks).length > 0) {
    flattenedData = makeFlattenedObject(courseMarks, "courseMarks");
  }

  // if finalTerm with others field exists, calculate grade, gradePoints
  if (
    courseMarks?.finalTerm &&
    (courseMarks?.classTest1 >= 0 ||
      courseMarks?.classTest2 >= 0 ||
      courseMarks?.midTerm >= 0)
  ) {
    const { classTest1, classTest2, midTerm } = {
      ...isFacultyBelongToCourse.courseMarks,
      ...courseMarks,
    };

    totalMarks = Math.ceil(
      Math.ceil(classTest1) +
        Math.ceil(midTerm) +
        Math.ceil(classTest2) +
        Math.ceil(courseMarks.finalTerm)
    );
    const courseResult = calculateGradePoints(totalMarks);
    flattenedData.grade = courseResult.grade;
    flattenedData.gradePoints = courseResult.gradePoints;
    flattenedData.isCompleted = courseResult.gradePoints !== 0 ? true : false;
  }
  // if only finalMark submitted, claculate grade, gradePoints
  else if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm } =
      isFacultyBelongToCourse.courseMarks;

    totalMarks = Math.ceil(
      Math.ceil(classTest1) +
        Math.ceil(midTerm) +
        Math.ceil(classTest2) +
        Math.ceil(courseMarks.finalTerm)
    );
    const courseResult = calculateGradePoints(totalMarks);
    flattenedData.grade = courseResult.grade;
    flattenedData.gradePoints = courseResult.gradePoints;
    flattenedData.isCompleted = courseResult.gradePoints !== 0 ? true : false;
  }

  // update the course marks
  const result = await EnrolledCourse.findByIdAndUpdate(
    isFacultyBelongToCourse._id,
    flattenedData,
    { new: true, runValidators: true }
  );

  return result;
};

// ---------------------- get my enrolled courses --------------------
const getMyEnrolledCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const student = await Student.findOne({ id: userId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }

  const enrolledCourseQuery = new QueryBuilder(
    OfferedCourse.find({ student: student._id }).populate(
      "semesterRegistration academicDepartment academicFaculty offeredCourse course faculty"
    ),
    query
  );

  const result = await enrolledCourseQuery.modelQuery;
  return result;
};
// export enrolled courses services
export const enrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  getMyEnrolledCoursesFromDB,
};
