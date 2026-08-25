import { defineMiddleware, sequence } from "astro:middleware";
import { drizzle } from "drizzle-orm/node-postgres";
import jwt from "jsonwebtoken";
import type { users } from "./db/schema";
import { TOKEN_SECRET } from "astro:env/server";

const dbUrl =
  process.env.DATABASE_URL ||
  (() => {
    throw new Error("DATABASE_URL is not defined");
  })();

const initDb = defineMiddleware((context, next) => {
  const db = drizzle(dbUrl);
  context.locals.db = db;
  return next();
});

const loginCheck = defineMiddleware(async (context, next) => {
  const auth = context.cookies.get("Authorization")?.value;
  context.locals.user = null;
  if (auth) {
    // jsonwebtoken kinda fails to throw proper error when token is expired so let's treat every exception as expired
    try {
      const user = jwt.verify(auth, TOKEN_SECRET);
      context.locals.user = user as Omit<typeof users.$inferSelect, "password">;
    } catch {
      context.locals.user = null;
    }
  }
  return next();
});

export const onRequest = sequence(initDb, loginCheck);
