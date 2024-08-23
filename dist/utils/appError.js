"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * AppError class extends Error class with custom statusCode and message
 */
class AppError extends Error {
    constructor(statusCode, message, stack = "") {
        super(message);
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
