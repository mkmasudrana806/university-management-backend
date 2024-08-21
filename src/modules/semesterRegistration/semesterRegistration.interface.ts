import { Model, Types } from "mongoose";

export type TSemesterRegistration = {
  academicSemester: Types.ObjectId;
  status: "UPCOMING" | "ONGOING" | "ENDED";
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
};

// isSemesterRegistrationExists static methods
export interface ISemesterRegistrationModel
  extends Model<TSemesterRegistration> {
  isSemesterRegistrationExists(
    semesterId: Types.ObjectId
  ): Promise<ISemesterRegistrationModel | null>;
}
