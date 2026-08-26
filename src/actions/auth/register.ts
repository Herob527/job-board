import { ActionError, defineAction } from "astro:actions";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users } from "#/db/schema";
import { registerSchema } from "#/features/auth/schema";

export default defineAction({
  input: registerSchema,
  handler: async (input, context) => {
    const { db } = context.locals;

    if (input.registerAs === "company") {
      console.log(input.companyName);
      console.log(input.locations);
      return;
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);

    await db.insert(users).values({
      email: input.email,
      name: input.name,
      surname: input.surname,
      password: hashedPassword,
      roles: ["candidate"],
    });
  },
});
