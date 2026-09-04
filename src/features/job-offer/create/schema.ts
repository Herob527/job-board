import z from "zod";
import { employmentTypeEnum, remoteTypeEnum, seniorityEnum } from "#/db/schema";

const schema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title can be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(5000, { message: "Description can be at most 5000 characters long" }),
  remoteType: z.enum(remoteTypeEnum.enumValues).array(),
  employmentType: z.enum(employmentTypeEnum.enumValues),
  seniority: z.enum(seniorityEnum.enumValues).array(),
  skills: z
    .object({
      name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(100, { message: "Name can be at most 100 characters long" }),
      seniority: z.enum(seniorityEnum.enumValues),
    })
    .array()
    .min(1, {
      message: "At least one skill must be provided",
    })
    .max(15, {
      message: "At most 15 skills can be provided",
    }),
  minSalary: z.int().nonnegative().nullable(),
  maxSalary: z.int().nonnegative().nullable(),
  currency: z.string().length(3),
  deadline: z.date(),
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters long" })
    .max(100, { message: "Location can be at most 100 characters long" })
    .array(),
});

export default schema;
