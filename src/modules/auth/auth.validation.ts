import { z } from "zod";

// login validation schema
const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: "Id is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

// change password validation schema
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});

// refresh token validation schema
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

// const forgot password validation schema
const forgotPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "User id is required!",
    }),
  }),
});

// const reset password validation schema
const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "User id is required!",
    }),
    newPassword: z.string({
      required_error: "New passwords is required!",
    }),
  }),
});

export const authValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
