"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentValidations = void 0;
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
// Define the guardian schema
const guardianSchema = zod_1.z.object({
    fatherName: zod_1.z.string().trim(),
    fatherContactNo: zod_1.z.string().trim(),
    fatherOccupation: zod_1.z.string().trim().optional(),
    motherName: zod_1.z.string().trim(),
    motherContactNo: zod_1.z.string().trim(),
    motherOccupation: zod_1.z.string().trim().optional(),
});
// Define the local guardian schema
const localGuardianSchema = zod_1.z.object({
    name: zod_1.z.string().trim(),
    occupation: zod_1.z.string().trim().optional(),
    contactNo: zod_1.z.string().trim(),
    address: zod_1.z.string().trim(),
});
// Define the user name schema for updating
const updateUserNameSchema = userNameSchema.partial();
// Define the guardian schema for updating
const updateGuardianSchema = guardianSchema.partial();
// Define the local guardian schema for updating
const updateLocalGuardianSchema = localGuardianSchema.partial();
// Define create a student validation schema
const createStudentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().trim().optional(),
        student: zod_1.z.object({
            name: userNameSchema,
            gender: zod_1.z.enum(["male", "female", "other"]),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().trim().email("Not a valid email address"),
            contactNo: zod_1.z.string().trim(),
            emergencyContactNo: zod_1.z.string().trim(),
            bloodGroup: zod_1.z
                .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
                .optional(),
            presentAddress: zod_1.z.string().trim(),
            permanentAddress: zod_1.z.string().trim(),
            guardian: guardianSchema,
            localGuardian: localGuardianSchema,
            admissionSemester: zod_1.z.string(),
            academicDepartment: zod_1.z.string(),
            profileImg: zod_1.z.string().optional(),
        }),
    }),
});
// Define update a student validation schema
const updateStudentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        student: zod_1.z.object({
            name: updateUserNameSchema.optional(), // Making the entire name object optional
            gender: zod_1.z.enum(["male", "female", "other"]).optional(),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().trim().email("Not a valid email address").optional(),
            contactNo: zod_1.z.string().trim().optional(),
            emergencyContactNo: zod_1.z.string().trim().optional(),
            bloodGroup: zod_1.z
                .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
                .optional(),
            presentAddress: zod_1.z.string().trim().optional(),
            permanentAddress: zod_1.z.string().trim().optional(),
            guardian: updateGuardianSchema.optional(), // Making the entire guardian object optional
            localGuardian: updateLocalGuardianSchema.optional(), // Making the entire localGuardian object optional
            admissionSemester: zod_1.z.string().optional(),
            academicDepartment: zod_1.z.string().optional(),
        }),
    }),
});
exports.studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema,
};
