import { model, Schema } from "mongoose";

import { Days } from "./offeredCourse.constants";
import { IOfferedCourseModel, TOfferedCourse } from "./offeredCourse.interface";

//offered course mongose schema
const offeredCourseSchema = new Schema<TOfferedCourse, IOfferedCourseModel>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "SemesterRegistration",
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Semester",
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AcademicDepartment",
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AcademicFaculty",
    },
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Faculty",
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    section: {
      type: Number,
      required: true,
    },
    days: [
      {
        type: String,
        enum: Days,
      },
    ],
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// is offered course exists statics method
offeredCourseSchema.statics.isOfferedCourseExists = async function (
  id: string
) {
  const result = await OfferedCourse.findById(id);
  return result;
};

export const OfferedCourse = model<TOfferedCourse, IOfferedCourseModel>(
  "OfferedCourse",
  offeredCourseSchema
);
