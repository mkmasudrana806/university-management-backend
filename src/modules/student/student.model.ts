import { Schema, model, connect } from "mongoose";
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
  IStudentModel,
} from "./student.interface";
import { isAlpha, isAlphanumeric, isEmail } from "validator";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
    maxlength: [20, "first name can not be more than 20 character"],
    trim: true,
    // custom validator
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: "{VALUE} is not capitalize",
    },
  },
  middleName: { type: String, trim: true },
  // validator package
  lastName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value: string) => isAlpha(value),
      message: "{VALUE} should be alphaneumeric",
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true, trim: true },
  fatherContactNo: { type: String, required: true, trim: true },
  fatherOccupation: { type: String, trim: true },
  motherName: { type: String, required: true, trim: true },
  motherContactNo: { type: String, required: true, trim: true },
  motherOccupation: { type: String, trim: true },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true, trim: true },
  occupation: { type: String, trim: true },
  contactNo: { type: String, trim: true, required: true },
  address: { type: String, trim: true, required: true },
});

// student schema
// const studentSchema = new Schema<TStudent, TStudentModel, TStudentMethods>({ // for instance method
const studentSchema = new Schema<TStudent, IStudentModel>(
  {
    // for static method
    id: { type: String, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: userNameSchema, required: true },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not valid",
      },
      required: true,
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: (value: string) => isEmail(value),
        message: "{VALUE} is not a valid email address",
      },
    },
    contactNo: { type: String, required: true, trim: true },
    emergencyContactNo: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    presentAddress: { type: String, required: true, trim: true },
    permanentAddress: { type: String, required: true, trim: true },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    profileImg: { type: String, default: "" },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// implementation of static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });

  return existingUser;
};

// user model
// const Student = model<TStudent, TStudentModel>("Student", studentSchema); // instance method
const Student = model<TStudent, IStudentModel>("Student", studentSchema); // static method

export default Student;
