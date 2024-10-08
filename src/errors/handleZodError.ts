import { ZodError, ZodIssue } from "zod";
import { TErrorScources, TGenericErrorResponse } from "../interface/error";

/**
 * handle zod validation error
 *
 * @param err app error from global error route
 * @returns return statusCode, message, errorScourses array
 */
const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorScources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  return {
    statusCode,
    message: "zod validation error",
    errorSources,
  };
};

export default handleZodError;
