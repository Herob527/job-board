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

export const onRequest = sequence(initDb);
