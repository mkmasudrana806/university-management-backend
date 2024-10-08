import mongoose from "mongoose";
import { TErrorScources, TGenericErrorResponse } from "../interface/error";

/**
 * handle mongoose Model validation error
 *
 * @param err app error from global error route
 * @returns return statusCode, message, errorScourses array
 */
const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorScources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    }
  );

  return {
    statusCode,
    message: "mongoose validation error",
    errorSources,
  };
};

export default handleValidationError;
