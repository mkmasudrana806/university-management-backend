import { Model } from "mongoose";

export type TMonths =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December ";

export type TSemesterName = "Autumn" | "Summer" | "Fall";

export type TSemesterCode = "01" | "02" | "03";

export type TSemesterNameCodeMapper = {
  [key: string]: string;
};

// create academic semester type
export type TAcademicSemester = {
  name: TSemesterName;
  code: TSemesterCode;
  year: string;
  startMonth: TMonths;
  endMonth: TMonths;
};

// static method interface, isSemesterExists
export interface ISemesterModel extends Model<TAcademicSemester> {
  isSemesterExists(id: string): Promise<TAcademicSemester | null>;
}
