// handle request and response.
import { NextFunction, Request, Response, RequestHandler } from "express";
import { studentServices } from "./student.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

// -------------------- get all students --------------------
const getAllStudents = catchAsync(async (req, res) => {
  const result = await studentServices.getAllStudentsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Student are retrieved successfully",
    data: result,
  });
});

// -------------------- get a single student --------------------
const getAStudent = catchAsync(async (req, res) => {
  const result = await studentServices.getAStudentFromDB(req.params?.id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found");
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Student is retrived successfully",
    data: result,
  });
});

// -------------------- delete a single student --------------------
const deleteAStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServices.deleteAStudentFromDB(studentId);

  if (!result)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "user and student is not deleted successfully"
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Student is deleted successfully",
    data: result,
  });
});

// -------------------- update a single student --------------------
const updateAStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { student } = req.body;
  const result = await studentServices.updateAStudentFromDB(studentId, student);

  if (!result)
    throw new AppError(httpStatus.NOT_FOUND, " student is not found");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Student is updated successfully",
    data: result,
  });
});

export const studentControllers = {
  getAllStudents,
  getAStudent,
  deleteAStudent,
  updateAStudent,
};
