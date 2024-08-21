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
exports.enrolledCourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../utils/appError"));
const offeredCourse_model_1 = require("../offeredCourse/offeredCourse.model");
const enrolledCourse_model_1 = require("./enrolledCourse.model");
const student_model_1 = __importDefault(require("../student/student.model"));
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const faculty_model_1 = __importDefault(require("../faculty/faculty.model"));
const makeFlattenedObject_1 = __importDefault(require("../../utils/makeFlattenedObject"));
const enrolledCourse_utils_1 = __importDefault(require("./enrolledCourse.utils"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
/**
 * ---------------------- enrolled a course into db--------------------
 *
 * @param userId currently logged in custom user id: 2024032001
 * @param payload offeredCourse id to enroll a course
 * @validations check offered course exists and the student already enrolled for this course
 * @validations check offered course doesn't exceeded it's maxCapacity
 * @validations student enrollment of courses dont' exceeded semester max credits
 * @validations before decrement maxCapacity of this course, atomic check if maxCapacity greater than 0
 */
// TODO: use transaction. currently mongo compass, for this i am not using a transaction
const createEnrolledCourseIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { offeredCourse } = payload;
    // check if offered course exists. include fields are required
    const isOfferedCourseExists = yield offeredCourse_model_1.OfferedCourse.findById(offeredCourse)
        .populate({
        path: "semesterRegistration",
        select: "maxCredit",
    })
        .populate({
        path: "course",
        select: "credits",
    })
        .select("academicSemester academicDepartment academicFaculty faculty maxCapacity");
    if (!isOfferedCourseExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Offered Course not found");
    }
    // semester registration and course type assertion of populated fields
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const course = isOfferedCourseExists.course;
    // check if the maxCapacity of offered courses not exceeded
    if (isOfferedCourseExists.maxCapacity === 0) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Room is full");
    }
    // check if the stuent is already registered for this course
    const student = yield student_model_1.default.findOne({ id: userId }, { _id: 1 });
    if (!student) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Student not found");
    }
    const isAlreadyEnrolled = yield enrolledCourse_model_1.EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists === null || isOfferedCourseExists === void 0 ? void 0 : isOfferedCourseExists.semesterRegistration,
        offeredCourse,
        student: student === null || student === void 0 ? void 0 : student._id,
    });
    if (isAlreadyEnrolled) {
        throw new appError_1.default(http_status_1.default.CONFLICT, "Student is already enrolled for this course");
    }
    // find out  enrolled courses total credits
    const takenCourseCredits = yield enrolledCourse_model_1.EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration._id,
                student: student._id,
            },
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "courseDetails",
            },
        },
        {
            $unwind: "$courseDetails",
        },
        {
            $group: {
                _id: "$student",
                takenCredits: { $sum: "$courseDetails.credits" },
            },
        },
    ]);
    // check totalCredits don't exceed this semester maxCredit
    const totalCredits = takenCourseCredits[0].takenCredits + (course === null || course === void 0 ? void 0 : course.credits);
    if (totalCredits > semesterRegistration.maxCredit) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Your have reached maximum credits limits");
    }
    // fill up the payload
    payload.semesterRegistration = semesterRegistration._id;
    payload.academicSemester = isOfferedCourseExists.academicSemester;
    payload.academicFaculty = isOfferedCourseExists.academicFaculty;
    payload.academicDepartment = isOfferedCourseExists.academicDepartment;
    payload.offeredCourse = offeredCourse;
    payload.course = course._id;
    payload.student = student._id;
    payload.faculty = isOfferedCourseExists.faculty;
    // note: before enrolled a course, again run atomic operation at find stage that maxCapacity greater than 0
    // decrement maxCapacity of an offered course
    const updatedOfferedCourse = yield offeredCourse_model_1.OfferedCourse.findOneAndUpdate({ _id: offeredCourse, maxCapacity: { $gt: 0 } }, { $inc: { maxCapacity: -1 } }, { new: true });
    if (!updatedOfferedCourse) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to enroll this course, max capacity exceeded it's limit");
    }
    // enrolled the course
    const result = yield enrolledCourse_model_1.EnrolledCourse.create(payload);
    if (!result) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Faild to enrolled to this course");
    }
    return result;
});
/**
 * ---------------------- enrolled a course into db--------------------
 *
 * @param userId faculty custom id: F-0001
 * @param payload updated payload data
 * @validations check if semesterRegistration, offeredCourse, student, faculty exists
 * @validations check if faculty belongs to this course
 */
const updateEnrolledCourseMarksIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
    // check if semester registration exists
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Semester Registration is not found");
    }
    // check if offered course exists
    const isOfferedCourseExists = yield offeredCourse_model_1.OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Offered Course is not found");
    }
    // check if student exists
    const isStudentExists = yield student_model_1.default.findById(student);
    if (!isStudentExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Student is not found");
    }
    // check if faculty exists
    const isFacultyExists = yield faculty_model_1.default.findOne({ id: userId });
    if (!isFacultyExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Faculty is not found");
    }
    // check if the offered course belong to the faculty
    const isFacultyBelongToCourse = yield enrolledCourse_model_1.EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: isFacultyExists._id,
    }).lean();
    if (!isFacultyBelongToCourse) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are forbidden");
    }
    let flattenedData = {};
    let totalMarks = 0;
    // dynamically update the enrolledCourse marks
    if (courseMarks && Object.keys(courseMarks).length > 0) {
        flattenedData = (0, makeFlattenedObject_1.default)(courseMarks, "courseMarks");
    }
    // if finalTerm with others field exists, calculate grade, gradePoints
    if ((courseMarks === null || courseMarks === void 0 ? void 0 : courseMarks.finalTerm) &&
        ((courseMarks === null || courseMarks === void 0 ? void 0 : courseMarks.classTest1) >= 0 ||
            (courseMarks === null || courseMarks === void 0 ? void 0 : courseMarks.classTest2) >= 0 ||
            (courseMarks === null || courseMarks === void 0 ? void 0 : courseMarks.midTerm) >= 0)) {
        const { classTest1, classTest2, midTerm } = Object.assign(Object.assign({}, isFacultyBelongToCourse.courseMarks), courseMarks);
        totalMarks = Math.ceil(Math.ceil(classTest1) +
            Math.ceil(midTerm) +
            Math.ceil(classTest2) +
            Math.ceil(courseMarks.finalTerm));
        const courseResult = (0, enrolledCourse_utils_1.default)(totalMarks);
        flattenedData.grade = courseResult.grade;
        flattenedData.gradePoints = courseResult.gradePoints;
        flattenedData.isCompleted = courseResult.gradePoints !== 0 ? true : false;
    }
    // if only finalMark submitted, claculate grade, gradePoints
    else if (courseMarks === null || courseMarks === void 0 ? void 0 : courseMarks.finalTerm) {
        const { classTest1, classTest2, midTerm } = isFacultyBelongToCourse.courseMarks;
        totalMarks = Math.ceil(Math.ceil(classTest1) +
            Math.ceil(midTerm) +
            Math.ceil(classTest2) +
            Math.ceil(courseMarks.finalTerm));
        const courseResult = (0, enrolledCourse_utils_1.default)(totalMarks);
        flattenedData.grade = courseResult.grade;
        flattenedData.gradePoints = courseResult.gradePoints;
        flattenedData.isCompleted = courseResult.gradePoints !== 0 ? true : false;
    }
    // update the course marks
    const result = yield enrolledCourse_model_1.EnrolledCourse.findByIdAndUpdate(isFacultyBelongToCourse._id, flattenedData, { new: true, runValidators: true });
    return result;
});
// ---------------------- get my enrolled courses --------------------
const getMyEnrolledCoursesFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.default.findOne({ id: userId });
    if (!student) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Student not found");
    }
    const enrolledCourseQuery = new QueryBuilder_1.default(offeredCourse_model_1.OfferedCourse.find({ student: student._id }).populate("semesterRegistration academicDepartment academicFaculty offeredCourse course faculty"), query);
    const result = yield enrolledCourseQuery.modelQuery;
    return result;
});
// export enrolled courses services
exports.enrolledCourseServices = {
    createEnrolledCourseIntoDB,
    updateEnrolledCourseMarksIntoDB,
    getMyEnrolledCoursesFromDB,
};
