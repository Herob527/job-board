import { defineMiddleware, sequence } from "astro:middleware";
import { drizzle } from "drizzle-orm/node-postgres";

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
  const s = await context.session?.get("user");
  const c = context.cookies.get("user")?.value;
  console.log({ s, c });
  return next();
});

export const onRequest = sequence(initDb, loginCheck);
