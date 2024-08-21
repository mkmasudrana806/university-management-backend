import { z } from "zod";

// Define the user name schema
const userNameSchema = z.object({
  firstName: z
    .string()
    .max(20, "First name can not be more than 20 characters")
    .trim(),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim(),
});

// Define the user name schema for updating
const updateUserNameSchema = userNameSchema.partial();

// Define create a Admin validation schema
const createAdminValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .trim()
      .max(20, "Password must be at least 20 characters")
      .optional(),
    admin: z.object({
      name: userNameSchema,
      designation: z.string(),
      gender: z.enum(["male", "female", "other"]),
      dateOfBirth: z.string().optional(),
      email: z.string().trim().email("Not a valid email address"),
      contactNo: z.string().trim(),
      emergencyContactNo: z.string().trim(),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
        .optional(),
      presentAddress: z.string().trim(),
      managementDepartment: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

// Define update a Admin validation schema
const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: updateUserNameSchema.optional(), // Making the entire name object optional
      designation: z.string().optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().trim().email("Not a valid email address").optional(),
      contactNo: z.string().trim().optional(),
      emergencyContactNo: z.string().trim().optional(),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
        .optional(),
      presentAddress: z.string().trim().optional(),
      managementDepartment: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const adminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
