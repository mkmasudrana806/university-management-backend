import { Router } from "express";
import { studentRoutes } from "../modules/student/student.routes";
import { userRoutes } from "../modules/user/user.routes";
import { semesterRoutes } from "../modules/academicSemester/semester.routes";
import { academicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.routes";
import { academicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.routes";
import { facultyRoutes } from "../modules/faculty/faculty.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { courseRoutes } from "../modules/courses/course.routes";
import { semesterRegistrationRoutes } from "../modules/semesterRegistration/SemesterRegistration.routes";
import { offeredCourseRoutes } from "../modules/offeredCourse/offeredCourse.routes";
import { authRoutes } from "../modules/auth/auth.route";
import { enrolledCourseRoutes } from "../modules/enrolledCourse/enrolledCourse.routes";

const router = Router();
router.use("/students", studentRoutes);
router.use("/users", userRoutes);
router.use("/semesters", semesterRoutes);
router.use("/academic-faculties", academicFacultyRoutes);
router.use("/academic-departments", academicDepartmentRoutes);
router.use("/faculties", facultyRoutes);
router.use("/admins", adminRoutes);

router.use("/courses", courseRoutes);
router.use("/semester-registrations", semesterRegistrationRoutes);
router.use("/offered-courses", offeredCourseRoutes);
router.use("/enrolled-courses", enrolledCourseRoutes);

router.use("/auth", authRoutes);

export default router;
