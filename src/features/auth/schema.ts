import z from "zod";

export const baseLoginSchema = z.object({
  email: z
    .email()
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(40, { message: "Email can be at most 40 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(40, { message: "Password can be at most 40 characters long" }),
});

export const loginSchema = baseLoginSchema.extend({});

const baseRegisterSchema = baseLoginSchema.extend({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(40, { message: "Name can be at most 40 characters long" }),
  surname: z
    .string()
    .min(3, { message: "Surname must be at least 3 characters long" })
    .max(40, { message: "Surname can be at most 40 characters long" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(40, { message: "Password can be at most 40 characters long" }),
});

export const registerSchema = z
  .discriminatedUnion("registerAs", [
    baseRegisterSchema.extend({
      registerAs: z.literal("candidate"),
    }),
    baseRegisterSchema.extend({
      registerAs: z.literal("company"),
      companyName: z
        .string()
        .min(3, { message: "Company name must be at least 3 characters long" })
        .max(40, { message: "Company name can be at most 40 characters long" }),
      registrationLocation: z.string().min(3).max(100),
    }),
  ])
  .refine((form) => form.password === form.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });
