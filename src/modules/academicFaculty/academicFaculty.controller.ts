import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { academicFacultyServices } from "./academicFaculty.service";

// create a new academic faculty
const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await academicFacultyServices.createAcademicFacultyIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic faculty successfully created",
    data: result,
  });
});

// get single academic faculty
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await academicFacultyServices.getSingleAcademicFacultyFromDB(
    facultyId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic faculty is retrieved successfully",
    data: result,
  });
});

// get all academic faculty
const getAllAcademicFaculty = catchAsync(async (req, res) => {
  const result = await academicFacultyServices.getAllAcademicFacultyFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Academic faculties are retrieved successfully",
    data: result,
  });
});

// update academic faculty
const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await academicFacultyServices.updateAcademicFacultyIntoDB(
    facultyId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic faculty updated successfully",
    data: result,
  });
});

export const academicFacultyControllers = {
  createAcademicFaculty,
  getSingleAcademicFaculty,
  getAllAcademicFaculty,
  updateAcademicFaculty,
};
