import { Schema, model } from "mongoose";
import { isEmail } from "validator";
import { IFacultyModel, TFaculty, TUserName } from "./faculty.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
    maxlength: [20, "first name can not be more than 20 character"],
    trim: true,
  },
  middleName: { type: String, trim: true },
  // validator package
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
});

// faculty schema
const facultySchema = new Schema<TFaculty, IFacultyModel>({
  id: { type: String, unique: true },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "User id is required"],
    unique: true,
    ref: "User",
  },
  name: { type: userNameSchema, required: true },
  designation: { type: String, required: true },
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
  profileImg: { type: String, default: "" },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: "AcademicDepartment",
  },
  isDeleted: { type: Boolean, default: false },
});

// implementation of static method
facultySchema.statics.isFacultyExists = async function (id: string) {
  const existingUser = await Faculty.findById(id);
  return existingUser;
};

// user model
const Faculty = model<TFaculty, IFacultyModel>("Faculty", facultySchema);

export default Faculty;
