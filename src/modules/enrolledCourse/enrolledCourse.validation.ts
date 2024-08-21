import { z } from "zod";

// create enrolled course validation schema
const createEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string({
      required_error: "offeredCourse is required!",
    }),
  }),
});

// update enrolledCourse marks validation schema
const updateEnrolledCourseMarksSchema = z.object({
  body: z.object({
    semesterRegistration: z.string({
      required_error: "SemesterRegistration is required",
    }),
    offeredCourse: z.string({
      required_error: "offeredCourse is required",
    }),
    student: z.string({
      required_error: "student is required",
    }),
    courseMarks: z.object({
      classTest1: z.number().optional(),
      midTerm: z.number().optional(),
      classTest2: z.number().optional(),
      finalTerm: z.number().optional(),
    }),
  }),
});


export const enrolledCourseValidations = {
  createEnrolledCourseValidationSchema,
  updateEnrolledCourseMarksSchema,
};
