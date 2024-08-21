"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// handle zod error functions
const handleZodError = (err) => {
    const statusCode = 400;
    const errorSources = err.issues.map((issue) => {
        return {
            path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
            message: issue.message,
        };
    });
    return {
        statusCode,
        message: "zod validation error",
        errorSources,
    };
};
exports.default = handleZodError;
