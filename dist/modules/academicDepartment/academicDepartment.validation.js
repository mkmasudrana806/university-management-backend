"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicDepartmentValidations = void 0;
const zod_1 = require("zod");
// validation schema for creating academic department
const createAcademicDepartmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: "Academic Department must be string",
            required_error: "Academic Department is required",
        }),
        academicFaculty: zod_1.z.string({
            invalid_type_error: "Academic faculty must be in string",
            required_error: "Academic Faculty is required",
        }),
    }),
});
// validation schema for updating academic department
const updateAcademicDepartmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            invalid_type_error: "Academic Department must be string",
            required_error: "Academic Department is required",
        })
            .optional(),
        academicFaculty: zod_1.z
            .string({
            invalid_type_error: "Academic faculty must be in string",
            required_error: "Academic Faculty is required",
        })
            .optional(),
    }),
});
exports.academicDepartmentValidations = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema,
};
