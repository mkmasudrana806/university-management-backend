"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseFaculty = exports.Course = void 0;
const mongoose_1 = require("mongoose");
// prerequisites courses schema
const preRequisiteCourestSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
// course schema
const courseSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true, trim: true },
    prefix: { type: String, required: true, trim: true },
    code: { type: Number, required: true, unique: true },
    credits: { type: Number, required: true },
    preRequisiteCourses: [preRequisiteCourestSchema],
    isDeleted: { type: Boolean, default: false },
});
exports.Course = (0, mongoose_1.model)("Course", courseSchema);
// course faculties schema
const courseFacultiesSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
        unique: true,
    },
    faculties: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Faculty",
        },
    ],
});
exports.CourseFaculty = (0, mongoose_1.model)("CourseFaculty", courseFacultiesSchema);
