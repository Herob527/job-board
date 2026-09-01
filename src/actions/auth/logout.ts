import { defineAction } from "astro:actions";

export default defineAction({
  handler: (_, context) => {
    context.cookies.delete("Authorization", {
      httpOnly: true,
      path: "/",
    });
    context.locals.user = null;
  },
});
