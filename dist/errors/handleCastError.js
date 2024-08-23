"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * handle mongoose objectId cast error
 *
 * @param err app error
 * @returns return statusCode, message, errorScourses array
 */
const handleCastError = (err) => {
    const statusCode = 400;
    const errorSources = [
        { path: err === null || err === void 0 ? void 0 : err.path, message: err === null || err === void 0 ? void 0 : err.message },
    ];
    return {
        statusCode,
        message: "Invalid ID",
        errorSources,
    };
};
exports.default = handleCastError;
