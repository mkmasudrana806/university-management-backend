"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterValidations = void 0;
const zod_1 = require("zod");
const semester_constant_1 = require("./semester.constant");
// create a new semester validation schema
const createSemesterValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.enum([...semester_constant_1.SemesterName]),
        code: zod_1.z.enum([...semester_constant_1.SemesterCode]),
        year: zod_1.z.string(),
        startMonth: zod_1.z.enum([...semester_constant_1.Months]),
        endMonth: zod_1.z.enum([...semester_constant_1.Months]),
    }),
});
// update a semester validation schema
const updateSemesterValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.enum([...semester_constant_1.SemesterName]).optional(),
        code: zod_1.z.enum([...semester_constant_1.SemesterCode]).optional(),
        year: zod_1.z.string().optional(),
        startMonth: zod_1.z.enum([...semester_constant_1.Months]).optional(),
        endMonth: zod_1.z.enum([...semester_constant_1.Months]).optional(),
    }),
});
exports.semesterValidations = {
    createSemesterValidationSchema,
    updateSemesterValidationSchema,
};
