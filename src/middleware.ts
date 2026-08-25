import { defineMiddleware, sequence } from "astro:middleware";
import { drizzle } from "drizzle-orm/node-postgres";
import jwt from "jsonwebtoken";

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
  console.log({ auth });
  if (auth) {
    const decoded = jwt.decode(auth);
    console.log({ decoded });
  }
  return next();
});

export const onRequest = sequence(initDb, loginCheck);
