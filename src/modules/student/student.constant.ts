import { TStudent } from "./student.interface";

export const studentSearchableFields = [
  "email",
  "name.firstName",
  "presentAddress",
];
export const allowedFields: (keyof TStudent)[] = [
  "name",
  "gender",
  "email",
  "dateOfBirth",
  "contactNo",
  "emergencyContactNo",
  "bloodGroup",
  "presentAddress",
  "permanentAddress",
  "guardian",
  "localGuardian",
  "profileImg",
  "admissionSemester",
  "academicDepartment",
];
