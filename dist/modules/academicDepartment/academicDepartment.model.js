"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicDepartment = void 0;
const mongoose_1 = require("mongoose");
const academicDepartmentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "AcademicFaculty",
    },
}, {
    timestamps: true,
});
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
exports.AcademicDepartment = (0, mongoose_1.model)("AcademicDepartment", academicDepartmentSchema);
