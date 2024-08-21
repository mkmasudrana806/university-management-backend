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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../utils/appError"));
const semester_model_1 = require("../academicSemester/semester.model");
const semesterRegistration_model_1 = require("./semesterRegistration.model");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const semesterRegistration_constants_1 = require("./semesterRegistration.constants");
const offeredCourse_model_1 = require("../offeredCourse/offeredCourse.model");
const mongoose_1 = __importDefault(require("mongoose"));
// ---------- create a new Semester Registration service ----------
const createSemesterRegistrationIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if there any registered semester that is already 'UPCOMMING' or 'ONGOING'
    const currentSemesterRegistrationStatus = yield semesterRegistration_model_1.SemesterRegistration.findOne({
        $or: [{ status: "UPCOMMING" }, { status: "ONGOING" }],
    });
    if (currentSemesterRegistrationStatus) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, `already there is a ${currentSemesterRegistrationStatus.status} registered semester`);
    }
    // check if academic semester is exist
    if (!(yield semester_model_1.Semester.isSemesterExists(String(payload.academicSemester)))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Academic semester not found");
    }
    // check if semester registration already exists
    const res = yield semesterRegistration_model_1.SemesterRegistration.isSemesterRegistrationExists(payload.academicSemester);
    if (res) {
        throw new appError_1.default(http_status_1.default.CONFLICT, "semester registration already exists");
    }
    // don't create new semester registration, if
    // create new semester registration
    const result = yield semesterRegistration_model_1.SemesterRegistration.create(payload);
    return result;
});
// ---------- get all semesters registrations service ----------
const getAllSemesterRegistrationFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterRegistrationQuery = new QueryBuilder_1.default(semesterRegistration_model_1.SemesterRegistration.find().populate("academicSemester"), query)
        .filter()
        .sort()
        .paginate()
        .fieldsLimiting();
    const result = yield semesterRegistrationQuery.modelQuery;
    return result;
});
// ---------- get a semester registration ----------
const getSemesterRegistrationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield semesterRegistration_model_1.SemesterRegistration.findById(id);
    return result;
});
// ---------- update a semester registration ----------
const updateSemesterRegistrationIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if semester registration exists
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(id);
    if (!isSemesterRegistrationExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "this semester registration is not found !");
    }
    const currentSemesterStatus = isSemesterRegistrationExists.status;
    // check if semester registration is already 'ENDED', we will not update
    if (currentSemesterStatus === semesterRegistration_constants_1.registrationStatus.ENDED) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "this semester registration already ENDED");
    }
    // upcomming ----- ongoing ------- ended.
    // possible status changes
    // upcoming ----- ongoing
    // ongoing ----- ended
    if (payload === null || payload === void 0 ? void 0 : payload.status) {
        if ((currentSemesterStatus === semesterRegistration_constants_1.registrationStatus.UPCOMING &&
            payload.status === semesterRegistration_constants_1.registrationStatus.ONGOING) ||
            (currentSemesterStatus === semesterRegistration_constants_1.registrationStatus.ONGOING &&
                payload.status === semesterRegistration_constants_1.registrationStatus.ENDED)) {
            const result = yield semesterRegistration_model_1.SemesterRegistration.findByIdAndUpdate(id, payload, {
                new: true,
            });
            return result;
        }
        else {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, `you can not change status directly ${currentSemesterStatus} to ${payload === null || payload === void 0 ? void 0 : payload.status}`);
        }
    }
    else {
        const result = yield semesterRegistration_model_1.SemesterRegistration.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result;
    }
});
// ---------- delete semester registration ----------
// const deleteSemesterRegistrationFromDB = async (id: string) => {
//   // check if the semester registration exists
//   if (!(await SemesterRegistration.findById(id))) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "Semester registration is not found!"
//     );
//   }
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     // delete the semester registration
//     const deletedSemesterRegistration =
//       await SemesterRegistration.findByIdAndDelete(id, { new: true, session });
//     if (!deletedSemesterRegistration) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Semester registration is failed to delete!"
//       );
//     }
//     // delete the offered courses belong to this semester registration
//     const deletedOfferedCourse = await OfferedCourse.findByIdAndDelete(id, {
//       new: true,
//       session,
//     });
//     if (!deletedOfferedCourse) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "offered course is failed to delete!"
//       );
//     }
//     await session.endSession();
//     await session.commitTransaction();
//     // const result = await SemesterRegistration.findByIdAndDelete(id);
//     // return result;
//     return null;
//   } catch (error) {
//     await session.endSession();
//     await session.abortTransaction();
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "offered course and semester registration are failed to delete!"
//     );
//   }
// };
// without transaction
const deleteSemesterRegistrationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the semester registration exists
    if (!(yield semesterRegistration_model_1.SemesterRegistration.findById(id))) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Semester registration is not found!");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // delete the semester registration
        const deletedSemesterRegistration = yield semesterRegistration_model_1.SemesterRegistration.findByIdAndDelete(id, { new: true, session });
        if (!deletedSemesterRegistration) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Semester registration is failed to delete!");
        }
        // delete the offered courses belong to this semester registration
        const deletedOfferedCourse = yield offeredCourse_model_1.OfferedCourse.deleteMany({
            semesterRegistration: id,
        }, { session });
        yield session.endSession();
        yield session.commitTransaction();
        return deletedSemesterRegistration;
    }
    catch (error) {
        yield session.endSession();
        yield session.abortTransaction();
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Faild to delete semester registration and offered courses");
    }
});
exports.SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB,
};
