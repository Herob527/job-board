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

export const registerSchema = loginSchema
	.extend({
		name: z
			.string()
			.min(3, { message: "Name must be at least 3 characters long" })
			.max(40, { message: "Name can be at most 40 characters long" }),
		surname: z
			.string()
			.min(3, { message: "Surname must be at least 3 characters long" })
			.max(40, { message: "Surname can be at most 40 characters long" }),
		country: z
			.string()
			.min(3, { message: "Country must be at least 3 characters long" })
			.max(40, { message: "Country can be at most 40 characters long" }),
		confirmPassword: z
			.string()
			.min(8, { message: "Password must be at least 8 characters long" })
			.max(40, { message: "Password can be at most 40 characters long" }),
	})
	.refine((form) => form.password === form.confirmPassword);
