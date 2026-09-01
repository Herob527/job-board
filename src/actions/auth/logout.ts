import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export default defineAction({
  handler: (_, context) => {
    context.cookies.delete("Authorization");
    context.locals.user = null;
  },
});
