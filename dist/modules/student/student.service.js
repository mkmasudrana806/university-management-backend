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
// -------------------- get all student from DB --------------------
const getAllStudentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const queryObj = { ...query }; // copied query object
    // let searchTerm = "";
    // if (query?.searchTerm) {
    //   searchTerm = query?.searchTerm as string;
    // }
    // // { email: { $regex: query.searchTerm, $options: i} }
    // // { presentAddress: { $regex: query.searchTerm, $options } }
    // // { 'name.firstName': { $regex: query.searchTerm, $options } }
    // // partial matching
    // const searchQuery = Student.find({
    //   $or: ["email", "name.firstName", "presentAddress"].map((field) => ({
    //     [field]: { $regex: searchTerm, $options: "i" },
    //   })),
    // });
    // // filtering
    // const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    // excludeFields.forEach((el) => delete queryObj[el]);
    // console.log({ query }, { queryObj });
    // const filterQuery = searchQuery.find(queryObj);
    // // sorting
    // let sort = "-createdAt";
    // if (query.sort) {
    //   sort = query.sort as string;
    // }
    // const sortQuery = filterQuery.sort(sort);
    // limiting and pagging
    // let page = 1;
    // let limit = 1;
    // let skip = 0;
    // if (query.limit) {
    //   limit = Number(query.limit);
    // }
    // if (query.page) {
    //   page = Number(query.page);
    //   skip = (page - 1) * limit;
    // }
    // // paginate query
    // const paginateQuery = sortQuery.skip(skip);
    // const limitQuery = paginateQuery.limit(limit);
    // field limiting
    // let fields = "-__v";
    // fields: 'name, email'
    // convert: fields: 'name email' space seperated
    // if (query.fields) {
    //   fields = (query.fields as string).split(",").join(" ");
    // }
    // const fieldsQuery = await limitQuery.select(fields);
    // return fieldsQuery;
    const studentQuery = new QueryBuilder_1.default(student_model_1.default.find()
        .populate("user")
        .populate("admissionSemester")
        .populate({
        path: "academicDepartment",
        populate: {
            path: "academicFaculty",
        },
    }), query)
        .search(student_constant_1.studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fieldsLimiting();
    const result = yield studentQuery.modelQuery;
    return result;
});
// -------------------- get a single student --------------------
// use populate, and nested populate
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
// -------------------- delete a single student --------------------
const deleteAStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield student_model_1.default.isUserExists(id);
    // if (!userExists) {
    //   throw new AppError(httpStatus.NOT_FOUND, "user doesn't exists");
    // }
    const session = yield mongoose_1.default.startSession();
    try {
        // start transaction
        session.startTransaction();
        // delete a student from DB (transaction-1)
        const deletedStudent = yield student_model_1.default.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });
        if (!deletedStudent) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete student");
        }
        // delete a user from DB (transaction-2)
        const deletedUser = yield user_model_1.User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });
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
// -------------------- update a student into DB --------------------
const updateAStudentFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // recursive function to make key/value pairs object
    const flattenObject = (obj, parentKey = "", result = {}) => {
        for (const key in obj) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof obj[key] === "object" &&
                !Array.isArray(obj[key]) &&
                obj[key] !== null) {
                flattenObject(obj[key], fullKey, result);
            }
            else {
                result[fullKey] = obj[key];
            }
        }
        return result;
    };
    const flattenedPayload = flattenObject(payload);
    const result = yield student_model_1.default.findOneAndUpdate({ id }, { $set: flattenedPayload }, { new: true });
    return result;
});
// export all the services
exports.studentServices = {
    getAllStudentsFromDB,
    getAStudentFromDB,
    deleteAStudentFromDB,
    updateAStudentFromDB,
};
