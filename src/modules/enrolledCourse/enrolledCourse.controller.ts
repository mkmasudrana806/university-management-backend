import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/appError";
import { enrolledCourseServices } from "./enrolledCourse.service";

// -------------------- create an enrolled course --------------------
const createEnrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await enrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Course is enrolled successfully",
    data: result,
  });
});

// -------------------- update enrolled course marks --------------------
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await enrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Marks is update successfully",
    data: result,
  });
});

// -------------------- update enrolled course marks --------------------
const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await enrolledCourseServices.getMyEnrolledCoursesFromDB(
    userId,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My enrolled courses are retrieved successfully",
    data: result,
  });
});

export const enrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourses,
};
