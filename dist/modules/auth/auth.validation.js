"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidations = void 0;
const zod_1 = require("zod");
// login validation schema
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({ required_error: "Id is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
// change password validation schema
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({ required_error: "Old password is required" }),
        newPassword: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
// refresh token validation schema
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: "Refresh token is required!",
        }),
    }),
});
// const forgot password validation schema
const forgotPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: "User id is required!",
        }),
    }),
});
// const reset password validation schema
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: "User id is required!",
        }),
        newPassword: zod_1.z.string({
            required_error: "New passwords is required!",
        }),
    }),
});
exports.authValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgotPasswordValidationSchema,
    resetPasswordValidationSchema,
};
