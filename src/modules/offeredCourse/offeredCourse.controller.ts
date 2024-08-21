import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { offeredCourseServices } from "./offeredCourse.service";

// ---------- create a new offered course ----------
const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.createOfferedCourseIntoDB(
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "offered course is created successfully",
    data: result,
  });
});

// ---------- get all offered courses ----------
const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.getAllOfferedCoursesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All offered courses are retrived successfully",
    data: result,
  });
});

// ---------- get my offered courses ----------
const getMyOfferedCourses = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await offeredCourseServices.getMyOfferedCoursesFromDB(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My offered courses are retrived successfully",
    data: result,
  });
});

// ---------- get single offered course ----------
const getOfferedCourse = catchAsync(async (req, res) => {
  const result = await offeredCourseServices.getOfferedCourseFromDB(
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Offered course is retrieved successfully",
    data: result,
  });
});

// ---------- delete an offered course -------------
const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.deleteOfferedCourseFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Offered course is deleted successfully",
    data: result,
  });
});

// ---------- update single offered course ----------
const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Offered course updated successfully",
    data: result,
  });
});

export const offeredCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getOfferedCourse,
  deleteOfferedCourse,
  updateOfferedCourse,
  getMyOfferedCourses,
};
