import { TAcademicSemester } from "../academicSemester/semester.interface";
import { User } from "./user.model";

// year semesterCode 4digit number
//ex: 2024 01 2101
const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString().padStart(4, "0");

  const lastStudentId = await findLastStudentId();
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentYearCode = lastStudentId?.substring(0, 4);

  const currentSemesterCode = payload.code;
  const currentYearCode = payload.year;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYearCode === currentYearCode
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

// find last student id
const findLastStudentId = async () => {
  const lastStudent = await User.findOne({ role: "student" }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .lean(); // Use lean to return plain JavaScript objects

  return lastStudent?.id ? lastStudent.id : undefined;
};

// generate faculty ID
//ex: F-0001
const generateFacultyId = async () => {
  const lastFacultyId = await findLastFacultyId();
  const lastFacultyIdCode = lastFacultyId?.split("-")[1] || "0";

  let incrementId = (Number(lastFacultyIdCode) + 1).toString().padStart(4, "0");
  incrementId = `F-${incrementId}`;
  return incrementId;
};

// find last faculty id
const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne({ role: "faculty" }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return lastFaculty?.id ? lastFaculty.id : undefined;
};

// generate admin ID
//ex: A-0001
const generateAdminId = async () => {
  const lastAdminId = await findLastAdminId();
  const lastAdminIdCode = lastAdminId?.split("-")[1] || "0";

  let incrementId = (Number(lastAdminIdCode) + 1).toString().padStart(4, "0");
  incrementId = `A-${incrementId}`;
  return incrementId;
};

// find last admin id
const findLastAdminId = async () => {
  const lastAdmin = await User.findOne({ role: "admin" }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return lastAdmin?.id ? lastAdmin.id : undefined;
};

export const userUtils = {
  generateStudentId,
  findLastStudentId,
  generateFacultyId,
  findLastFacultyId,
  generateAdminId,
  findLastAdminId,
};
