import { ActionError, defineAction } from "astro:actions";
import { registerSchema } from "#/features/auth/schema";
import { users } from "#/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

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
