import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export default defineAction({
	input: z.object({
		email: z.email(),
		password: z.string(),
	}),
	handler: (input, context) => {},
});
