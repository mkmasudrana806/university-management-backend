import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SemesterServices } from "./semester.services";

// create a new Semester
const createSemester = catchAsync(async (req, res) => {
  // save data to database
  const result = await SemesterServices.createSemesterIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Academic semester is created successfully",
    data: result,
  });
});

// get all semesters
const getAllSemesters = catchAsync(async (req, res) => {
  // get all semester from database
  const result = await SemesterServices.getAllSemesterFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All semesters retrived successfully",
    data: result,
  });
});

// get single semester
const getSingleSemester = catchAsync(async (req, res) => {
  const result = await SemesterServices.getSingleSemesterFromDB(
    req.params?.semesterId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "semester retrieved successfully",
    data: result,
  });
});

// update single semester
const updateSingleSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await SemesterServices.updateSingleSemesterFromDB(
    semesterId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "semester updated successfully",
    data: result,
  });
});

export const semesterControllers = {
  createSemester,
  getAllSemesters,
  getSingleSemester,
  updateSingleSemester,
};
