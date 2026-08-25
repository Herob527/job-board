import { ActionError, defineAction } from "astro:actions";
import { eq } from "drizzle-orm";
import { loginSchema } from "#/features/auth/schema";
import { users } from "../../db/schema";
import bcrypt from "bcrypt";

export default defineAction({
  input: loginSchema,
  handler: async (input, context) => {
    try {
      const { db } = context.locals;
      const user = await db
        .select({
          password: users.password,
        })
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (user.length === 0) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "User not found or password is incorrect",
        });
      }
      const { password } = user[0];
      const passwordMatch = await bcrypt.compare(input.password, password);
      if (!passwordMatch) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "User not found or password is incorrect",
        });
      }
      if (input.rememberMe) {
        context.cookies.set("user", user);
      } else {
        context.session?.set("user", user);
      }
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
});
