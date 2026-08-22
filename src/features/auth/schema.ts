import z from "zod";

export const loginSchema = z.object({
	email: z
		.email()
		.min(5, { message: "Email must be at least 5 characters long" })
		.max(40, { message: "Email can be at most 40 characters long" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		.max(40, { message: "Password can be at most 40 characters long" }),
});
