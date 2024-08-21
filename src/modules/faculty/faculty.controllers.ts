// handle request and response.
import { NextFunction, Request, Response, RequestHandler } from "express";

import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";
import { facultyServices } from "./faculty.services";

// get all faculties
const getAllFaculties = catchAsync(async (req, res) => {
  const result = await facultyServices.getAllFacultiesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "faculties are retrieved successfully",
    data: result,
  });
});

// get a single faculty
const getAFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await facultyServices.getAFacultyFromDB(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found");
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Faculty is retrived successfully",
    data: result,
  });
});

// delete a single faculty
const deleteAFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await facultyServices.deleteAFacultyFromDB(id);

  if (!result)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "user and faculty is not deleted successfully"
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "faculty is deleted successfully",
    data: result,
  });
});

// update a single faculty
const updateAFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;
  const result = await facultyServices.updateAFacultyFromDB(id, faculty);

  if (!result)
    throw new AppError(httpStatus.NOT_FOUND, " faculty is not found");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Faculty is updated successfully",
    data: result,
  });
});

export const facultyControllers = {
  getAllFaculties,
  getAFaculty,
  deleteAFaculty,
  updateAFaculty,
};
