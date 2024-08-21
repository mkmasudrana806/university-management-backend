import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import httpStatus from "http-status";
import AppError from "../../utils/appError";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
    },
  },
  {
    timestamps: true,
  }
);

// pre middleware: is department already exist
// academicDepartmentSchema.pre("save", async function (next) {
//   const isDepartmentAlreadyExists = await AcademicDepartment.findOne({
//     name: this.name,
//   });
//   if (isDepartmentAlreadyExists) {
//     throw new AppError(httpStatus.NOT_FOUND, "Department already exists");
//   }
//   next();
// });

export const AcademicDepartment = model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema
);
