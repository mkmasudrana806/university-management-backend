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
const facultySchema = new mongoose_1.Schema({
    id: { type: String, unique: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    profileImg: { type: String, default: "" },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "AcademicDepartment",
    },
    isDeleted: { type: Boolean, default: false },
});
// implementation of static method
facultySchema.statics.isFacultyExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield Faculty.findById(id);
        return existingUser;
    });
};
// user model
const Faculty = (0, mongoose_1.model)("Faculty", facultySchema);
exports.default = Faculty;
