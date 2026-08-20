import { sql } from "drizzle-orm";
import { uuid, pgTable, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("User", {
	id: uuid().primaryKey().default(sql`uuidv7()`),
	name: varchar("name", { length: 255 }).notNull(),
	surname: varchar("surname", { length: 255 }),
	country: varchar("country", { length: 255 }),
	email: varchar("email", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
});

export const candidate = pgTable("Candidate", {
	id: uuid().primaryKey(),
});
