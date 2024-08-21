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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const course_constants_1 = require("./course.constants");
const course_model_1 = require("./course.model");
// ------------------- create a course -------------------
const createCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.create(payload);
    return result;
});
// ------------------- get all courses -------------------
const getAllCoursesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const courseQuery = new QueryBuilder_1.default(course_model_1.Course.find().populate("preRequisiteCourses.course"), query)
        .search(course_constants_1.courseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fieldsLimiting();
    const result = yield courseQuery.modelQuery;
    const meta = yield courseQuery.countTotal();
    console.log(meta);
    return result;
});
// ------------------- get single course -------------------
const getSingleCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.findById(id).populate("preRequisiteCoures.course");
    return result;
});
// ------------------- delete course -------------------
const deleteCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
// ------------------- update course -------------------
// with transaction
// const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
//   // filter out normal property and pre requisite courses
//   const { preRequisiteCourses, ...normalProperties } = payload;
//   let result;
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     // handle pre requisite courses logic
//     if (preRequisiteCourses) {
//       const addCourses: any[] = [];
//       const removeCourses: any[] = [];
//       preRequisiteCourses.forEach((course: any) => {
//         if (course.isDeleted) {
//           removeCourses.push(course.course);
//         } else {
//           addCourses.push(course);
//         }
//       });
//       // update add courses
//       if (addCourses.length > 0) {
//         result = await Course.findByIdAndUpdate(
//           id,
//           { $push: { preRequisiteCourses: { $each: addCourses } } },
//           { new: true, session }
//         );
//         if (!result) {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             "Faild to add new courses"
//           );
//         }
//       }
//       // update remove courses
//       if (removeCourses.length > 0) {
//         result = await Course.findByIdAndUpdate(
//           id,
//           {
//             $pull: {
//               preRequisiteCourses: {
//                 course: { $in: removeCourses },
//               },
//             },
//           },
//           { new: true, session }
//         );
//         if (!result) {
//           throw new AppError(httpStatus.BAD_REQUEST, "Faild to remove courses");
//         }
//       }
//     }
//     // update normal properties
//     if (Object.entries(normalProperties).length > 0) {
//       result = await Course.findByIdAndUpdate(id, normalProperties, {
//         new: true,
//         session,
//       });
//       if (!result) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Faild to update courses");
//       }
//     }
//     await session.commitTransaction();
//     await session.endSession();
//     return result;
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(httpStatus.BAD_REQUEST, "Faild to update courses");
//   }
// };
// without transaction
const updateCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // filter out normal property and pre requisite courses
    const { preRequisiteCourses } = payload, normalProperties = __rest(payload, ["preRequisiteCourses"]);
    console.log(preRequisiteCourses, normalProperties);
    let result;
    // handle pre requisite courses logic
    if (preRequisiteCourses) {
        const addCourses = [];
        const removeCourses = [];
        preRequisiteCourses.forEach((course) => {
            if (course.isDeleted) {
                removeCourses.push(course.course);
            }
            else {
                addCourses.push(course);
            }
        });
        // update add courses
        if (addCourses.length > 0) {
            result = yield course_model_1.Course.findByIdAndUpdate(id, { $addToSet: { preRequisiteCourses: { $each: addCourses } } }, { new: true });
            console.log("add courses updated", addCourses);
        }
        // update remove courses
        if (removeCourses.length > 0) {
            result = yield course_model_1.Course.findByIdAndUpdate(id, {
                $pull: {
                    preRequisiteCourses: {
                        course: { $in: removeCourses },
                    },
                },
            }, { new: true });
            console.log("remove courses updated", removeCourses);
        }
    }
    // update normal properties
    if (Object.entries(normalProperties).length > 0) {
        result = yield course_model_1.Course.findByIdAndUpdate(id, normalProperties, {
            new: true,
        });
    }
    return result;
});
// ----------------- assign faculties to a course ------------------------
const assignFacultiesToCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.CourseFaculty.findByIdAndUpdate(id, {
        course: id,
        $addToSet: {
            faculties: { $each: payload },
        },
    }, { upsert: true, new: true });
    return result;
});
// ----------------- remove faculties from a course ------------------------
const removeFacultiesFromCourseFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.CourseFaculty.findByIdAndUpdate(id, {
        $pull: { faculties: { $in: payload } },
    }, { new: true });
    return result;
});
exports.courseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    deleteCourseFromDB,
    updateCourseIntoDB,
    assignFacultiesToCourseIntoDB,
    removeFacultiesFromCourseFromDB,
};
