import { model, Schema } from "mongoose";
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCoures,
} from "./courses.interface";

// prerequisites courses schema
const preRequisiteCourestSchema = new Schema<TPreRequisiteCoures>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// course schema
const courseSchema = new Schema<TCourse>({
  title: { type: String, required: true, unique: true, trim: true },
  prefix: { type: String, required: true, trim: true },
  code: { type: Number, required: true, unique: true },
  credits: { type: Number, required: true },
  preRequisiteCourses: [preRequisiteCourestSchema],
  isDeleted: { type: Boolean, default: false },
});

export const Course = model<TCourse>("Course", courseSchema);

// course faculties schema
const courseFacultiesSchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Course",
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
    },
  ],
});

export const CourseFaculty = model<TCourseFaculty>(
  "CourseFaculty",
  courseFacultiesSchema
);
