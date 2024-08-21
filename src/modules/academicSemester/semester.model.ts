import { model, Schema } from "mongoose";
import { ISemesterModel, TAcademicSemester } from "./semester.interface";
import { Months, SemesterCode, SemesterName } from "./semester.constant";
import AppError from "../../utils/appError";
import httpStatus from "http-status";

// semester schema
const SemesterSchema = new Schema<TAcademicSemester, ISemesterModel>(
  {
    name: {
      type: String,
      required: true,
      enum: SemesterName,
    },
    code: {
      type: String,
      required: true,
      enum: SemesterCode,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
    },
    endMonth: {
      type: String,
      enum: Months,
    },
  },
  {
    timestamps: true,
  }
);

// isSemesterExists statics
SemesterSchema.statics.isSemesterExists = async function (id: string) {
  const result = await Semester.findById(id);
  return result;
};

// pre hook triggered before create new semester
// check same name semester and year already exists in schema or not
SemesterSchema.pre("save", async function (next) {
  const isSemesterExist = await Semester.findOne({
    name: this.name,
    year: this.year,
  });

  if (isSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Semester is already exists!");
  }
  next();
});
export const Semester = model<TAcademicSemester, ISemesterModel>(
  "Semester",
  SemesterSchema
);
