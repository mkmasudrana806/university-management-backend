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
exports.OfferedCourse = void 0;
const mongoose_1 = require("mongoose");
const offeredCourse_constants_1 = require("./offeredCourse.constants");
//offered course mongose schema
const offeredCourseSchema = new mongoose_1.Schema({
    semesterRegistration: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "SemesterRegistration",
    },
    academicSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Semester",
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "AcademicDepartment",
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "AcademicFaculty",
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
    },
    faculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Faculty",
    },
    maxCapacity: {
        type: Number,
        required: true,
    },
    section: {
        type: Number,
        required: true,
    },
    days: [
        {
            type: String,
            enum: offeredCourse_constants_1.Days,
        },
    ],
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
// is offered course exists statics method
offeredCourseSchema.statics.isOfferedCourseExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.OfferedCourse.findById(id);
        return result;
    });
};
exports.OfferedCourse = (0, mongoose_1.model)("OfferedCourse", offeredCourseSchema);
