import { ActionError, defineAction } from "astro:actions";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { loginSchema } from "#/features/auth/schema";
import { users } from "../../db/schema";

export default defineAction({
  input: loginSchema,
  handler: async (input, context) => {
    try {
      const { db, jwtService } = context.locals;
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (user.length === 0) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "User not found or password is incorrect",
        });
      }
      const { password, ...rest } = user[0];
      const passwordMatch = await bcrypt.compare(input.password, password);
      if (!passwordMatch) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "User not found or password is incorrect",
        });
      }
      const token = await jwtService.generateJwt(rest);

      context.cookies.set("Authorization", token, {
        httpOnly: true,
        path: "/",
        maxAge: 3600 * 24,
      });
      return token;
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
