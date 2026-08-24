import { defineAction } from "astro:actions";
import { registerSchema } from "#/features/auth/schema";

export default defineAction({
  input: registerSchema,
  handler: (input, context) => {
    console.log(input);
  },
});
