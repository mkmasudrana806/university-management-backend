import { model, Schema } from "mongoose";
import {
  ISemesterRegistrationModel,
  TSemesterRegistration,
} from "./semesterRegistration.interface";
import { semesterRegistrationStatus } from "./semesterRegistration.constants";

// create a new semester registration mongose schema
const semesterRegistrationSchema = new Schema<
  TSemesterRegistration,
  ISemesterRegistrationModel
>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
      ref: "Semester",
    },
    status: {
      type: String,
      enum: semesterRegistrationStatus,
      default: "UPCOMING",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minCredit: { type: Number, required: true, default: 3 },
    maxCredit: { type: Number, required: true, default: 15 },
  },
  {
    timestamps: true,
  }
);

// isSemesterRegistrationExists statics model
semesterRegistrationSchema.statics.isSemesterRegistrationExists =
  async function (semesterId: string) {
    const result = await SemesterRegistration.findOne({
      academicSemester: semesterId,
    });
    return result;
  };

export const SemesterRegistration = model<
  TSemesterRegistration,
  ISemesterRegistrationModel
>("SemesterRegistration", semesterRegistrationSchema);
