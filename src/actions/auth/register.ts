import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export default defineAction({
	input: z.object({
		name: z.string(),
		surname: z.string(),
		country: z.string(),
		email: z.email(),
		password: z.string(),
		confirmPassword: z.string(),
	}),
	handler: (input, context) => {},
});
