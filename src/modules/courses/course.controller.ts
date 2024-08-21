import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { courseServices } from "./course.service";

// ----------------- create a new course -----------------
const createCourse = catchAsync(async (req, res) => {
  const result = await courseServices.createCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course is createds successfully ",
    data: result,
  });
});

// ----------------- get all courses -----------------
const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCoursesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All courses are retrieved successfully",
    data: result,
  });
});

// ----------------- get single course -----------------
const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course is retrieved successfully",
    data: result,
  });
});

//  ----------------- delete course -----------------
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course is deleted successfully",
    data: result,
  });
});

// ----------------- update course -----------------
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.updateCourseIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course is updated successfully",
    data: result,
  });
});

// ----------------- assign faculties to a course -----------------
const assignFacultiesToCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await courseServices.assignFacultiesToCourseIntoDB(
    courseId,
    faculties
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faculties are assigned successfully to a course",
    data: result,
  });
});

// ----------------- remove faculties from a course -----------------
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await courseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faculties are removed successfully from a course",
    data: result,
  });
});

export const courseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesToCourse,
  removeFacultiesFromCourse,
};
