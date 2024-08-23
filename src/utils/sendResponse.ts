import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: T;
  data: T;
};

/**
 * custom sendResponse method
 *
 * @param res res object
 * @param data data
 */
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data?.meta,
    data: data.data,
  });
};

export default sendResponse;
