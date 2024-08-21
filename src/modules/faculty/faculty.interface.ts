import { Model, Types } from "mongoose";

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  designation: string;
  gender: "male" | "female" | "other";
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

// ************ static method ***********
export interface IFacultyModel extends Model<TFaculty> {
  isFacultyExists(id: string): Promise<TFaculty | null>;
}
