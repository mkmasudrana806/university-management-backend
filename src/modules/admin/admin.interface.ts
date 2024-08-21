import { Model, Types } from "mongoose";

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TAdmin = {
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
  profileImg?: string;
  managementDepartment: Types.ObjectId;
  isDeleted: boolean;
};

// ************ static method ***********
export interface IAdminModel extends Model<TAdmin> {
  isUserExists(id: string): Promise<TAdmin | null>;
}
