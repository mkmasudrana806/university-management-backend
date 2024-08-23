import mongoose from "mongoose";
import { TErrorScources, TGenericErrorResponse } from "../interface/error";

/**
 * handle mongoose objectId cast error
 *
 * @param err app error
 * @returns return statusCode, message, errorScourses array
 */
const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorScources = [
    { path: err?.path, message: err?.message },
  ];

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleCastError;
