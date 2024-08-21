"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offeredCourseValidations = void 0;
const zod_1 = require("zod");
const offeredCourse_constants_1 = require("./offeredCourse.constants");
// start or end time schema
const timeStringSchema = zod_1.z.string().refine((time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}, {
    message: "Invalid time format, expected 'HH:MM' in 24 hour format",
});
// create offered course schema
const createOfferedCourseSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        semesterRegistration: zod_1.z.string(),
        academicFaculty: zod_1.z.string(),
        academicDepartment: zod_1.z.string(),
        course: zod_1.z.string(),
        faculty: zod_1.z.string(),
        maxCapacity: zod_1.z.number(),
        section: zod_1.z.number(),
        days: zod_1.z.array(zod_1.z.enum([...offeredCourse_constants_1.Days])),
        // start and end time format validation
        startTime: timeStringSchema,
        endTime: timeStringSchema,
    })
        .refine((body) => {
        // here any date we can take. here i have taken UTC time
        // startTime: 10:30 => 1970-01-01T10:30
        // endTime: 12:30 => 1970-01-01T12:30
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
    }, {
        message: "Start time should be before End time !",
    }),
});
// update offered course schema
const updateOfferedCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        faculty: zod_1.z.string(),
        maxCapacity: zod_1.z.number(),
        days: zod_1.z.array(zod_1.z.enum([...offeredCourse_constants_1.Days])),
        // start and end time format validation
        startTime: timeStringSchema,
        endTime: timeStringSchema,
    }),
});
exports.offeredCourseValidations = {
    createOfferedCourseSchema,
    updateOfferedCourseSchema,
};
