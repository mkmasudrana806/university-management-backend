import { ref } from "joi";
import { model, Schema } from "mongoose";
import {
  TEnrolledCourseMarks,
  TEnrolledCourse,
} from "./enrolledCourse.interface";
import { Grade } from "./enrolledCourse.constant";

const courseMarksSchema = new Schema<TEnrolledCourseMarks>({
  classTest1: { type: Number, min: 0, max: 10, default: 0 },
  midTerm: { type: Number, min: 0, max: 30, default: 0 },
  classTest2: { type: Number, min: 0, max: 10, default: 0 },
  finalTerm: { type: Number, min: 0, max: 50, default: 0 },
});

// enrolled course schema
const enrolledCourseSchema = new Schema<TEnrolledCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "semesterRegistration",
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "AcademicSemester",
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "AcademicFaculty",
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "AcademicDepartment",
  },
  offeredCourse: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "OfferedCourse",
  },
  course: { type: Schema.Types.ObjectId, required: true, ref: "Course" },
  student: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
  faculty: { type: Schema.Types.ObjectId, required: true, ref: "Faculty" },
  isEnrolled: { type: Boolean, default: true },
  courseMarks: { type: courseMarksSchema, default: {} },
  grade: {
    type: String,
    enum: Grade,
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

export const EnrolledCourse = model<TEnrolledCourse>(
  "EnrolledCourse",
  enrolledCourseSchema
);
