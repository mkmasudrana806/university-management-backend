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

// Define the guardian schema
const guardianSchema = z.object({
  fatherName: z.string().trim(),
  fatherContactNo: z.string().trim(),
  fatherOccupation: z.string().trim().optional(),
  motherName: z.string().trim(),
  motherContactNo: z.string().trim(),
  motherOccupation: z.string().trim().optional(),
});

// Define the local guardian schema
const localGuardianSchema = z.object({
  name: z.string().trim(),
  occupation: z.string().trim().optional(),
  contactNo: z.string().trim(),
  address: z.string().trim(),
});

// Define the user name schema for updating
const updateUserNameSchema = userNameSchema.partial();

// Define the guardian schema for updating
const updateGuardianSchema = guardianSchema.partial();

// Define the local guardian schema for updating
const updateLocalGuardianSchema = localGuardianSchema.partial();

// Define create a student validation schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().trim().optional(),
    student: z.object({
      name: userNameSchema,
      gender: z.enum(["male", "female", "other"]),
      dateOfBirth: z.string().optional(),
      email: z.string().trim().email("Not a valid email address"),
      contactNo: z.string().trim(),
      emergencyContactNo: z.string().trim(),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
        .optional(),
      presentAddress: z.string().trim(),
      permanentAddress: z.string().trim(),
      guardian: guardianSchema,
      localGuardian: localGuardianSchema,
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

// Define update a student validation schema
const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameSchema.optional(), // Making the entire name object optional
      gender: z.enum(["male", "female", "other"]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().trim().email("Not a valid email address").optional(),
      contactNo: z.string().trim().optional(),
      emergencyContactNo: z.string().trim().optional(),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
        .optional(),
      presentAddress: z.string().trim().optional(),
      permanentAddress: z.string().trim().optional(),
      guardian: updateGuardianSchema.optional(), // Making the entire guardian object optional
      localGuardian: updateLocalGuardianSchema.optional(), // Making the entire localGuardian object optional
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
