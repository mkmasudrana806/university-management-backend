import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";

// create a new academic Department into DB
const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

// get all academic Faculties from the database
const getAllAcademicDepartmentFromDB = async () => {
  const result = await AcademicDepartment.find().populate("academicFaculty");
  return result;
};

// get single academic Department
const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result = await AcademicDepartment.findById(id).populate(
    "academicFaculty"
  );
  return result;
};

// update a academic Department
const updateAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(
    {
      _id: id,
    },
    payload,
    {
      new: true,
    }
  );
  return result;
};

export const academicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
};
