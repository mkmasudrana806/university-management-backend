"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * handle mongoose Model validation error
 *
 * @param err app error from global error route
 * @returns return statusCode, message, errorScourses array
 */
const handleValidationError = (err) => {
    const statusCode = 400;
    const errorSources = Object.values(err.errors).map((val) => {
        return {
            path: val === null || val === void 0 ? void 0 : val.path,
            message: val === null || val === void 0 ? void 0 : val.message,
        };
    });
    return {
        statusCode,
        message: "mongoose validation error",
        errorSources,
    };
};
exports.default = handleValidationError;
