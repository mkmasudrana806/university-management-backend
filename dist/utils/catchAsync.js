"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * try... catch block handler for request response controller
 *
 * @param fn an async function to be passed
 * @returns return a Promise that resolves when the function completes  or rejects when the function rejects
 */
const catchAsync = (fn) => {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
exports.default = catchAsync;
