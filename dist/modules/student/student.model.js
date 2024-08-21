"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: [20, "first name can not be more than 20 character"],
        trim: true,
        // custom validator
        validate: {
            validator: function (value) {
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
            validator: (value) => (0, validator_1.isAlpha)(value),
            message: "{VALUE} should be alphaneumeric",
        },
    },
});
const guardianSchema = new mongoose_1.Schema({
    fatherName: { type: String, required: true, trim: true },
    fatherContactNo: { type: String, required: true, trim: true },
    fatherOccupation: { type: String, trim: true },
    motherName: { type: String, required: true, trim: true },
    motherContactNo: { type: String, required: true, trim: true },
    motherOccupation: { type: String, trim: true },
});
const localGuardianSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    occupation: { type: String, trim: true },
    contactNo: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
});
// student schema
// const studentSchema = new Schema<TStudent, TStudentModel, TStudentMethods>({ // for instance method
const studentSchema = new mongoose_1.Schema({
    // for static method
    id: { type: String, unique: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        validate: {
            validator: (value) => (0, validator_1.isEmail)(value),
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Semester",
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "AcademicDepartment",
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "AcademicFaculty",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// implementation of static method
studentSchema.statics.isUserExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield Student.findOne({ id });
        return existingUser;
    });
};
// user model
// const Student = model<TStudent, TStudentModel>("Student", studentSchema); // instance method
const Student = (0, mongoose_1.model)("Student", studentSchema); // static method
exports.default = Student;
