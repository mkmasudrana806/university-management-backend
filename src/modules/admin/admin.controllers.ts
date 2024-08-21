// handle request and response.
import { NextFunction, Request, Response, RequestHandler } from "express";

import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";
import { adminServices } from "./admin.services";

// get all admins
const getAllAdmins = catchAsync(async (req, res) => {
  const result = await adminServices.getAllAdminFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admins are retrieved successfully",
    data: result,
  });
});

// get a single admin
const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getSingleAdminFromDB(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin is retrived successfully",
    data: result,
  });
});

// delete a single admin
const deleteSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.deleteSingleAdminFromDB(id);

  if (!result)
    throw new AppError(
      httpStatus.NOT_FOUND,
      "user and Admin is not deleted successfully"
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin is deleted successfully",
    data: result,
  });
});

// update a single admin
const updateSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;
  
  const result = await adminServices.updateSingleAdminFromDB(id, admin);

  if (!result) throw new AppError(httpStatus.NOT_FOUND, " Admin is not found");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin is updated successfully",
    data: result,
  });
});

export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
  deleteSingleAdmin,
  updateSingleAdmin,
};
