import { Types } from "mongoose";

export type TPreRequisiteCoures = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

// course type
export type TCourse = {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses: [];
  isDeleted: boolean;
};

// asign faculties
export type TCourseFaculty = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
