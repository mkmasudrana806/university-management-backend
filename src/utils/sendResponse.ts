import { Response } from "express";

type TResponse<T, U> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: U;
  data: T;
};

/**
 * custom sendResponse method
 *
 * @param res res object
 * @param data data
 */
const sendResponse = <T, U>(res: Response, data: TResponse<T, U>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data?.meta,
    data: data.data,
  });
};

export default sendResponse;
