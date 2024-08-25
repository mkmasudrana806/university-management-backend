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
exports.studentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const student_model_1 = __importDefault(require("./student.model"));
const appError_1 = __importDefault(require("../../utils/appError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const student_constant_1 = require("./student.constant");
const makeFlattenedObject_1 = __importDefault(require("../../utils/makeFlattenedObject"));
const allowedUpdatedData_1 = __importDefault(require("../../utils/allowedUpdatedData"));
const semester_model_1 = require("../academicSemester/semester.model");
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
/**
 * -------------------- get all student from DB --------------------
 *
 * @param query req.query object
 * @features functionality to search, filter, sort, pagination, fieldsLimiting and count total meta data and populated with user, admissionSemester and academicDepartment
 * @example in query, searchTerm=atel&email=masud@gmail.com&sort=name&fields=name,email,phone,address&page=2&limit=20 or any of them.
 * @returns return all students and meta data
 */
const getAllStudentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const studentQuery = new QueryBuilder_1.default(student_model_1.default.find().populate("user").populate("admissionSemester").populate({
        path: "academicDepartment",
    }), query)
        .search(student_constant_1.studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fieldsLimiting();
    const metaData = yield studentQuery.countTotal();
    const result = yield studentQuery.modelQuery;
    return { metaData, result };
});
/**
 * -------------------- get a single student --------------------
 *
 * @param id student id (mongodb id)
 * @returns return found result
 */
const getAStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield student_model_1.default.findById(id)
        .populate("user")
        .populate("admissionSemester")
        .populate({
        path: "academicDepartment",
        populate: {
            path: "academicFaculty",
        },
    });
    return result;
});
/**
 * -------------------- delete a single student --------------------
 *
 * @param id mongodb id
 * @features transaction is used to maintain consistency
 * @returns return deleted student data
 */
const deleteAStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield student_model_1.default.isUserExists(id);
    if (!userExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "user doesn't exists");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        // start transaction
        session.startTransaction();
        // delete a student from Student collection (transaction-1)
        const deletedStudent = yield student_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedStudent) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete student");
        }
        // delete an user from User collection (transaction-2)
        const deletedUser = yield user_model_1.User.findByIdAndUpdate(deletedStudent.user, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete user");
        }
        // commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return deletedStudent;
    }
    catch (error) {
        // abort the transaction
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete student");
    }
});
/**
 * -------------------- update a student into DB --------------------
 *
 * @param id student id ( mongodb id )
 * @param payload updated student data
 * @validations check user, academicDepartment, admissionSemester exists
 * @features update only allowed fields, skip others fields even provided to update
 * @returns return updated student data
 */
const updateAStudentFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check user exists, and not blocked
    const user = yield student_model_1.default.findById(id).populate("user");
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exists!");
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    if (((_a = user === null || user === void 0 ? void 0 : user.user) === null || _a === void 0 ? void 0 : _a.status) === "blocked") {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User is already Blocked!");
    }
    // make new object to update student data
    const updatedData = (0, allowedUpdatedData_1.default)(student_constant_1.allowedFields, payload);
    // check admission semester exists
    if (payload === null || payload === void 0 ? void 0 : payload.admissionSemester) {
        const admissionSemester = yield semester_model_1.Semester.findById(payload.admissionSemester);
        if (!admissionSemester) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Admission semester is not found!");
        }
    }
    // check academicDepartment semester exists
    if (payload === null || payload === void 0 ? void 0 : payload.academicDepartment) {
        const academicDepartment = yield academicDepartment_model_1.AcademicDepartment.findById(payload.academicDepartment);
        if (!academicDepartment) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Academic Department is not found!");
        }
        // set academic faculty dynamically
        payload.academicFaculty = academicDepartment.academicFaculty;
    }
    // make any non-primary object to flattened object
    const flattenedPayload = (0, makeFlattenedObject_1.default)(updatedData);
    const result = yield student_model_1.default.findByIdAndUpdate(id, { $set: flattenedPayload }, { new: true, runValidators: true });
    return result;
});
// export all the services
exports.studentServices = {
    getAllStudentsFromDB,
    getAStudentFromDB,
    deleteAStudentFromDB,
    updateAStudentFromDB,
};
