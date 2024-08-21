import { z } from "zod";

// validation schema for creating academic department
const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Academic Department must be string",
      required_error: "Academic Department is required",
    }),
    academicFaculty: z.string({
      invalid_type_error: "Academic faculty must be in string",
      required_error: "Academic Faculty is required",
    }),
  }),
});

// validation schema for updating academic department
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Academic Department must be string",
        required_error: "Academic Department is required",
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: "Academic faculty must be in string",
        required_error: "Academic Faculty is required",
      })
      .optional(),
  }),
});

export const academicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
