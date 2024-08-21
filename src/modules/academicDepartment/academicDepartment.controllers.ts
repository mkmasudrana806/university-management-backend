import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { academicDepartmentServices } from "./academicDepartment.service";
import AppError from "../../utils/appError";

// create a new academic Department
const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic department successfully created!",
    data: result,
  });
});

// get single academic Department
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await academicDepartmentServices.getSingleAcademicDepartmentFromDB(
      departmentId
    );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Couldn't found any department");
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Department is retrieved successfully",
    data: result,
  });
});

// get all academic Department
const getAllAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.getAllAcademicDepartmentFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Academic departments are retrieved successfully",
    data: result,
  });
});

// update academic Department
const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await academicDepartmentServices.updateAcademicDepartmentIntoDB(
      departmentId,
      req.body
    );
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No department is found in the database"
    );
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Department updated successfully",
    data: result,
  });
});

export const academicDepartmentControllers = {
  createAcademicDepartment,
  getSingleAcademicDepartment,
  getAllAcademicDepartment,
  updateAcademicDepartment,
};
