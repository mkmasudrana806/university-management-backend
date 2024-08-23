import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * try... catch block handler for request response controller
 *
 * @param fn an async function to be passed
 * @returns return a Promise that resolves when the function completes  or rejects when the function rejects
 */
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;
