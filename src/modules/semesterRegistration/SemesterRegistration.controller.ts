import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SemesterRegistrationServices } from "./SemesterRegistration.service";

// ---------- create a new Semester registration ----------
const createSemesterRegistration = catchAsync(async (req, res) => {
  // save data to database
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Semester registration is created successfully",
    data: result,
  });
});

// ---------- get all semester registration ----------
const getAllSemestersRegistration = catchAsync(async (req, res) => {
  // get all semester registration from database
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(
      req.query
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All semesters Registrations are retrived successfully",
    data: result,
  });
});

// ---------- get single semester registration ----------
const getSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getSemesterRegistrationFromDB(
      req.params.id
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "semester registration is retrieved successfully",
    data: result,
  });
});

// ---------- update single semester registration ----------
const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
      id,
      req.body
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "semester registration updated successfully",
    data: result,
  });
});

// ---------- delete single semester registration ----------
const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(
      req.params.id
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "semester registration is deleted successfully",
    data: result,
  });
});

export const semesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemestersRegistration,
  getSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
