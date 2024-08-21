"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterRegistrationValidations = void 0;
const zod_1 = require("zod");
const semesterRegistration_constants_1 = require("./semesterRegistration.constants");
// create semester registration schema
const createSemesterRegistrationSchema = zod_1.z.object({
    body: zod_1.z.object({
        academicSemester: zod_1.z.string(),
        status: zod_1.z
            .enum([...semesterRegistration_constants_1.semesterRegistrationStatus])
            .optional(),
        startDate: zod_1.z.string().datetime(),
        endDate: zod_1.z.string().datetime(),
        minCredit: zod_1.z.number(),
        maxCredit: zod_1.z.number(),
    }),
});
// update semester registration schema
const updateSemesterRegistrationSchema = zod_1.z.object({
    body: zod_1.z.object({
        academicSemester: zod_1.z.string().optional(),
        status: zod_1.z
            .enum([...semesterRegistration_constants_1.semesterRegistrationStatus])
            .optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        minCredit: zod_1.z.number().optional(),
        maxCredit: zod_1.z.number().optional(),
    }),
});
exports.semesterRegistrationValidations = {
    createSemesterRegistrationSchema,
    updateSemesterRegistrationSchema,
};
