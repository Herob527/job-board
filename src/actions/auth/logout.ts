import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export default defineAction({
  input: z.object(),
  handler: (input, context) => {},
});
