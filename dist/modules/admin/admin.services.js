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
exports.adminServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = __importDefault(require("../../utils/appError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const admin_model_1 = __importDefault(require("./admin.model"));
const admin_constant_1 = require("./admin.constant");
// get all admins from DB
const getAllAdminFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const adminQuery = new QueryBuilder_1.default(admin_model_1.default.find().populate("managementDepartment"), query)
        .search(admin_constant_1.adminSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fieldsLimiting();
    const result = yield adminQuery.modelQuery;
    return result;
});
// get a single admin
const getSingleAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.default.findById(id).populate("managementDepartment");
    return result;
});
// delete a single faculty
const deleteSingleAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield admin_model_1.default.isUserExists(id);
    if (!userExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "user doesn't exists");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        // start transaction
        session.startTransaction();
        // delete an admin from Admin collection (transaction-1)
        const deleteFaculty = yield admin_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deleteFaculty) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete student");
        }
        // delete an admin from User collection (transaction-2)
        const deletedUser = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete user");
        }
        // commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return deleteFaculty;
    }
    catch (error) {
        // abort the transaction
        yield session.abortTransaction();
        yield session.endSession();
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete an admin");
    }
});
// update an admin into DB
const updateSingleAdminFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield admin_model_1.default.findByIdAndUpdate(id, { $set: flattenedPayload }, { new: true, runValidators: true });
    return result;
});
// export all the services
exports.adminServices = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    deleteSingleAdminFromDB,
    updateSingleAdminFromDB,
};
