"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_routes_1 = require("../modules/student/student.routes");
const user_routes_1 = require("../modules/user/user.routes");
const semester_routes_1 = require("../modules/academicSemester/semester.routes");
const academicFaculty_routes_1 = require("../modules/academicFaculty/academicFaculty.routes");
const academicDepartment_routes_1 = require("../modules/academicDepartment/academicDepartment.routes");
const faculty_routes_1 = require("../modules/faculty/faculty.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const course_routes_1 = require("../modules/courses/course.routes");
const SemesterRegistration_routes_1 = require("../modules/semesterRegistration/SemesterRegistration.routes");
const offeredCourse_routes_1 = require("../modules/offeredCourse/offeredCourse.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const enrolledCourse_routes_1 = require("../modules/enrolledCourse/enrolledCourse.routes");
const router = (0, express_1.Router)();
router.use("/students", student_routes_1.studentRoutes);
router.use("/users", user_routes_1.userRoutes);
router.use("/semesters", semester_routes_1.semesterRoutes);
router.use("/academic-faculties", academicFaculty_routes_1.academicFacultyRoutes);
router.use("/academic-departments", academicDepartment_routes_1.academicDepartmentRoutes);
router.use("/faculties", faculty_routes_1.facultyRoutes);
router.use("/admins", admin_routes_1.adminRoutes);
router.use("/courses", course_routes_1.courseRoutes);
router.use("/semester-registrations", SemesterRegistration_routes_1.semesterRegistrationRoutes);
router.use("/offered-courses", offeredCourse_routes_1.offeredCourseRoutes);
router.use("/enrolled-courses", enrolledCourse_routes_1.enrolledCourseRoutes);
router.use("/auth", auth_route_1.authRoutes);
exports.default = router;
