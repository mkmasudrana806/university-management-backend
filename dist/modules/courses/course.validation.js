"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidations = void 0;
const zod_1 = require("zod");
const preRequisiteCoursesSchema = zod_1.z.object({
    course: zod_1.z.string(),
    isDeleted: zod_1.z.boolean().optional(),
});
// create a new course validation schema
const createCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        prefix: zod_1.z.string(),
        code: zod_1.z.number(),
        credits: zod_1.z.number(),
        preRequisiteCourses: zod_1.z.array(preRequisiteCoursesSchema).optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
// update a course validation schema
const updateCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        prefix: zod_1.z.string().optional(),
        code: zod_1.z.number().optional(),
        credits: zod_1.z.number().optional(),
        preRequisiteCourses: zod_1.z.array(preRequisiteCoursesSchema).optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
// assign faculties to a course schema
const assignFacultiesToCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        faculties: zod_1.z.array(zod_1.z.string()),
    }),
});
exports.courseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
    assignFacultiesToCourseSchema,
};
