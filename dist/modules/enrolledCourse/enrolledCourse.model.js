"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourse = void 0;
const mongoose_1 = require("mongoose");
const enrolledCourse_constant_1 = require("./enrolledCourse.constant");
const courseMarksSchema = new mongoose_1.Schema({
    classTest1: { type: Number, min: 0, max: 10, default: 0 },
    midTerm: { type: Number, min: 0, max: 30, default: 0 },
    classTest2: { type: Number, min: 0, max: 10, default: 0 },
    finalTerm: { type: Number, min: 0, max: 50, default: 0 },
});
// enrolled course schema
const enrolledCourseSchema = new mongoose_1.Schema({
    semesterRegistration: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "semesterRegistration",
    },
    academicSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "AcademicSemester",
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "AcademicFaculty",
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "AcademicDepartment",
    },
    offeredCourse: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "OfferedCourse",
    },
    course: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Course" },
    student: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Student" },
    faculty: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Faculty" },
    isEnrolled: { type: Boolean, default: true },
    courseMarks: { type: courseMarksSchema, default: {} },
    grade: {
        type: String,
        enum: enrolledCourse_constant_1.Grade,
        default: "NA",
    },
    gradePoints: {
        type: Number,
        min: 0,
        max: 4,
        default: 0,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
});
exports.EnrolledCourse = (0, mongoose_1.model)("EnrolledCourse", enrolledCourseSchema);
