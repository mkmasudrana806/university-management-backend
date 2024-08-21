import { z } from "zod";

const preRequisiteCoursesSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

// create a new course validation schema
const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    preRequisiteCourses: z.array(preRequisiteCoursesSchema).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

// update a course validation schema
const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z.array(preRequisiteCoursesSchema).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

// assign faculties to a course schema
const assignFacultiesToCourseSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});
export const courseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  assignFacultiesToCourseSchema,
};
