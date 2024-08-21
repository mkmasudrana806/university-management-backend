import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// RequestHandler: manage type of req, res, next etc
// -------------------- create a student --------------------
const createStudent = catchAsync(async (req, res) => {
  // pass data to service
  const { password, student: studentData } = req.body;

  // save data to database
  const result = await UserServices.createStudentIntoDB(
    req.file,
    password,
    studentData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Student created successfully",
    data: result,
  });
});

// -------------------- create a faculty --------------------
const createFaculty = catchAsync(async (req, res) => {
  // pass data to service
  const { password, faculty: facultyData } = req.body;

  // save data to database
  const result = await UserServices.createFacultyIntoDB(
    req.file,
    password,
    facultyData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "faculty created successfully",
    data: result,
  });
});

// -------------------- create an admin --------------------
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(
    req.file,
    password,
    adminData
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "admin created successfully",
    data: result,
  });
});

// -------------------- getMe ---------------------
const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

// -------------------- changeUserStatus ---------------------
const changeUserStatus = catchAsync(async (req, res) => {
  const result = await UserServices.changeUserStatus(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status is changed successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeUserStatus,
};
