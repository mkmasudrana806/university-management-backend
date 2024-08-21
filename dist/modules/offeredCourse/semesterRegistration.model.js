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
exports.offeredCourse = void 0;
const mongoose_1 = require("mongoose");
const offeredCourse_constants_1 = require("./offeredCourse.constants");
// create a new semester registration mongose schema
const offeredCourseSchema = new mongoose_1.Schema({
    academicSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: "Semester",
    },
    status: {
        type: String,
        enum: offeredCourse_constants_1.offeredCourseStatus,
        default: "UPCOMMING",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minCredit: { type: Number, required: true, default: 3 },
    maxCredit: { type: Number, required: true, default: 15 },
}, {
    timestamps: true,
});
// isofferedCourseExists statics model
offeredCourseSchema.statics.isofferedCourseExists = function (semesterId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield exports.offeredCourse.findOne({
            academicSemester: semesterId,
        });
        return result;
    });
};
exports.offeredCourse = (0, mongoose_1.model)("offeredCourse", offeredCourseSchema);
