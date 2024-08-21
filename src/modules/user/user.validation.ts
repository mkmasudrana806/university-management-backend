import z from "zod";
import { USER_STATUS } from "./user.constant";

// Define the user
const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "password must be in string format",
    })
    .max(20, "Password can not be more than 20 characters")
    .optional(),
});

// change user status
const changeUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...(USER_STATUS as [string, ...string[]])]),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeUserStatusValidationSchema,
};
