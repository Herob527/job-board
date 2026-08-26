import { defineMiddleware, sequence } from "astro:middleware";
import { drizzle } from "drizzle-orm/node-postgres";
import jwtService from "./utils/JwtService";

const dbUrl =
  process.env.DATABASE_URL ||
  (() => {
    throw new Error("DATABASE_URL is not defined");
  })();

const initDeps = defineMiddleware((context, next) => {
  const deps: Partial<Deps> = {};
  deps.db = drizzle(dbUrl);
  deps.jwtService = jwtService;
  Object.assign(context.locals, deps);
  return next();
});

const loginCheck = defineMiddleware(async (context, next) => {
  const auth = context.cookies.get("Authorization")?.value;
  context.locals.user = null;
  if (auth) {
    const {
      payload: user,
      isExpired,
      unknownFailure,
    } = await jwtService.verifyJwt(auth);

    if (!isExpired && !unknownFailure) {
      context.locals.user = user;
      if (!import.meta.env.DEV) {
        context.cookies.delete("Authorization");
      }
    }
  }
  return next();
});

export const onRequest = sequence(initDeps, loginCheck);
