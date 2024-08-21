import { z } from "zod";
import { semesterRegistrationStatus } from "./semesterRegistration.constants";

// create semester registration schema
const createSemesterRegistrationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z
      .enum([...semesterRegistrationStatus] as [string, ...string[]])
      .optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number(),
    maxCredit: z.number(),
  }),
});

// update semester registration schema
const updateSemesterRegistrationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...(semesterRegistrationStatus as [string, ...string[]])])
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

export const semesterRegistrationValidations = {
  createSemesterRegistrationSchema,
  updateSemesterRegistrationSchema,
};
