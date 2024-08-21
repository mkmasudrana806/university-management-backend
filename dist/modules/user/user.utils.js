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
exports.userUtils = void 0;
const user_model_1 = require("./user.model");
// year semesterCode 4digit number
//ex: 2024 01 2101
const generateStudentId = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = (0).toString().padStart(4, "0");
    const lastStudentId = yield findLastStudentId();
    const lastStudentSemesterCode = lastStudentId === null || lastStudentId === void 0 ? void 0 : lastStudentId.substring(4, 6);
    const lastStudentYearCode = lastStudentId === null || lastStudentId === void 0 ? void 0 : lastStudentId.substring(0, 4);
    const currentSemesterCode = payload.code;
    const currentYearCode = payload.year;
    if (lastStudentId &&
        lastStudentSemesterCode === currentSemesterCode &&
        lastStudentYearCode === currentYearCode) {
        currentId = lastStudentId.substring(6);
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
    incrementId = `${payload.year}${payload.code}${incrementId}`;
    return incrementId;
});
// find last student id
const findLastStudentId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastStudent = yield user_model_1.User.findOne({ role: "student" }, { id: 1, _id: 0 })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .lean(); // Use lean to return plain JavaScript objects
    return (lastStudent === null || lastStudent === void 0 ? void 0 : lastStudent.id) ? lastStudent.id : undefined;
});
// generate faculty ID
//ex: F-0001
const generateFacultyId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastFacultyId = yield findLastFacultyId();
    const lastFacultyIdCode = (lastFacultyId === null || lastFacultyId === void 0 ? void 0 : lastFacultyId.split("-")[1]) || "0";
    let incrementId = (Number(lastFacultyIdCode) + 1).toString().padStart(4, "0");
    incrementId = `F-${incrementId}`;
    return incrementId;
});
// find last faculty id
const findLastFacultyId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastFaculty = yield user_model_1.User.findOne({ role: "faculty" }, { id: 1, _id: 0 })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .lean(); // Use lean to return plain JavaScript objects
    return (lastFaculty === null || lastFaculty === void 0 ? void 0 : lastFaculty.id) ? lastFaculty.id : undefined;
});
// generate admin ID
//ex: A-0001
const generateAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastAdminId = yield findLastAdminId();
    const lastAdminIdCode = (lastAdminId === null || lastAdminId === void 0 ? void 0 : lastAdminId.split("-")[1]) || "0";
    let incrementId = (Number(lastAdminIdCode) + 1).toString().padStart(4, "0");
    incrementId = `A-${incrementId}`;
    return incrementId;
});
// find last admin id
const findLastAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastAdmin = yield user_model_1.User.findOne({ role: "admin" }, { id: 1, _id: 0 })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .lean(); // Use lean to return plain JavaScript objects
    return (lastAdmin === null || lastAdmin === void 0 ? void 0 : lastAdmin.id) ? lastAdmin.id : undefined;
});
exports.userUtils = {
    generateStudentId,
    findLastStudentId,
    generateFacultyId,
    findLastFacultyId,
    generateAdminId,
    findLastAdminId,
};
