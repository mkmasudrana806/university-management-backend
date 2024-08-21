import { Model, Types } from "mongoose";

export type Days = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

// offered course type
export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  section: number;
  days: Days[];
  startTime: string;
  endTime: string;
};

// time schedule type
export type TSchedule = {
  days: Days[];
  startTime: string;
  endTime: string;
};

// isOfferedCourseExists statics method interface
export interface IOfferedCourseModel extends Model<TOfferedCourse> {
  isOfferedCourseExists(id: string): Promise<TOfferedCourse | null>;
}
