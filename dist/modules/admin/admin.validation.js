"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminValidations = void 0;
const zod_1 = require("zod");
// Define the user name schema
const userNameSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .max(20, "First name can not be more than 20 characters")
        .trim(),
    middleName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z.string().trim(),
});
// Define the user name schema for updating
const updateUserNameSchema = userNameSchema.partial();
// Define create a Admin validation schema
const createAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string()
            .trim()
            .max(20, "Password must be at least 20 characters")
            .optional(),
        admin: zod_1.z.object({
            name: userNameSchema,
            designation: zod_1.z.string(),
            gender: zod_1.z.enum(["male", "female", "other"]),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().trim().email("Not a valid email address"),
            contactNo: zod_1.z.string().trim(),
            emergencyContactNo: zod_1.z.string().trim(),
            bloodGroup: zod_1.z
                .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
                .optional(),
            presentAddress: zod_1.z.string().trim(),
            managementDepartment: zod_1.z.string(),
            profileImg: zod_1.z.string().optional(),
        }),
    }),
});
// Define update a Admin validation schema
const updateAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        admin: zod_1.z.object({
            name: updateUserNameSchema.optional(), // Making the entire name object optional
            designation: zod_1.z.string().optional(),
            gender: zod_1.z.enum(["male", "female", "other"]).optional(),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().trim().email("Not a valid email address").optional(),
            contactNo: zod_1.z.string().trim().optional(),
            emergencyContactNo: zod_1.z.string().trim().optional(),
            bloodGroup: zod_1.z
                .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
                .optional(),
            presentAddress: zod_1.z.string().trim().optional(),
            managementDepartment: zod_1.z.string().optional(),
            profileImg: zod_1.z.string().optional(),
        }),
    }),
});
exports.adminValidations = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
};
