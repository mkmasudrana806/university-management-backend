"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrolledCourseValidations = void 0;
const zod_1 = require("zod");
// create enrolled course validation schema
const createEnrolledCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        offeredCourse: zod_1.z.string({
            required_error: "offeredCourse is required!",
        }),
    }),
});
// update enrolledCourse marks validation schema
const updateEnrolledCourseMarksSchema = zod_1.z.object({
    body: zod_1.z.object({
        semesterRegistration: zod_1.z.string({
            required_error: "SemesterRegistration is required",
        }),
        offeredCourse: zod_1.z.string({
            required_error: "offeredCourse is required",
        }),
        student: zod_1.z.string({
            required_error: "student is required",
        }),
        courseMarks: zod_1.z.object({
            classTest1: zod_1.z.number().optional(),
            midTerm: zod_1.z.number().optional(),
            classTest2: zod_1.z.number().optional(),
            finalTerm: zod_1.z.number().optional(),
        }),
    }),
});
exports.enrolledCourseValidations = {
    createEnrolledCourseValidationSchema,
    updateEnrolledCourseMarksSchema,
};
