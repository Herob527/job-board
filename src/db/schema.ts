import { sql } from "drizzle-orm";
import {
	date,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const remoteTypeEnum = pgEnum("remote_type", [
	"Office",
	"Hybrid",
	"Remote",
]);
export const employmentTypeEnum = pgEnum("employment_type", [
	"Employment Contact",
	"B2B",
	"Mandate",
]);
export const seniorityEnum = pgEnum("seniority", ["Junior", "Mid", "Senior"]);
export const applicationStatusEnum = pgEnum("application_status", [
	"Sent",
	"Seen",
	"Interested",
	"Hired",
	"Rejected",
]);

const timestamps = {
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable("User", {
	id: uuid().primaryKey().default(sql`uuidv7()`),
	name: varchar("name", { length: 255 }).notNull(),
	surname: varchar("surname", { length: 255 }),
	country: varchar("country", { length: 255 }),
	email: varchar("email", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	...timestamps,
});

export const candidate = pgTable("Candidate", {
	id: uuid()
		.primaryKey()
		.references(() => users.id),
	...timestamps,
});

export const candidateSkill = pgTable(
	"CandidateSkill",
	{
		userId: uuid()
			.references(() => users.id)
			.notNull(),
		name: varchar("name", { length: 255 }).notNull(),
		seniority: seniorityEnum().notNull(),
		...timestamps,
	},
	(t) => [primaryKey({ columns: [t.userId, t.name] })],
);

export const candidateExperience = pgTable(
	"CandidateExperience",
	{
		userId: uuid()
			.references(() => users.id)
			.notNull(),
		companyName: varchar("company_name", { length: 255 }).notNull(),
		startDate: date().notNull(),
		endDate: date(),
		description: text().notNull(),
		stack: text().array().notNull().default(sql`'{}'`),
		...timestamps,
	},
	(t) => [primaryKey({ columns: [t.userId, t.companyName] })],
);

export const candidateProject = pgTable("CandidateProject", {
	id: uuid().primaryKey().default(sql`uuidv7()`),
	userId: uuid()
		.references(() => users.id)
		.notNull(),
	link: varchar("link", { length: 1024 }),
	description: text().notNull(),
	stack: text().array().notNull().default(sql`'{}'`),
	...timestamps,
});

export const company = pgTable("Company", {
	id: uuid().primaryKey().default(sql`uuidv7()`),
	name: varchar("name", { length: 255 }).notNull(),
	location: text().array().notNull().default(sql`'{}'`),
	...timestamps,
});

export const recruiter = pgTable("Recruiter", {
	id: uuid()
		.primaryKey()
		.references(() => users.id),
	companyId: uuid()
		.references(() => company.id)
		.notNull(),
	...timestamps,
});

export const companyAdmin = pgTable("CompanyAdmin", {
	id: uuid()
		.primaryKey()
		.references(() => users.id),
	companyId: uuid()
		.references(() => company.id)
		.notNull(),
	...timestamps,
});

export const platformAdmin = pgTable("PlatformAdmin", {
	id: uuid()
		.primaryKey()
		.references(() => users.id),
	...timestamps,
});

export const jobOffer = pgTable("JobOffer", {
	id: uuid().primaryKey().default(sql`uuidv7()`),
	companyId: uuid()
		.references(() => company.id)
		.notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text().notNull(),
	remoteType: remoteTypeEnum()
		.array()
		.notNull()
		.default(sql`'{}'::remote_type[]`),
	minSalary: integer(),
	maxSalary: integer(),
	currency: varchar("currency", { length: 16 }),
	employmentType: employmentTypeEnum()
		.array()
		.notNull()
		.default(sql`'{}'::employment_type[]`),
	seniority: seniorityEnum().array().notNull().default(sql`'{}'::seniority[]`),
	location: text().array().notNull().default(sql`'{}'`),
	...timestamps,
});

export const jobOfferSkill = pgTable(
	"JobOfferSkill",
	{
		jobOfferId: uuid()
			.references(() => jobOffer.id)
			.notNull(),
		name: varchar("name", { length: 255 }).notNull(),
		seniority: seniorityEnum().notNull(),
		...timestamps,
	},
	(t) => [primaryKey({ columns: [t.jobOfferId, t.name] })],
);

export const resume = pgTable("Resume", {
	userId: uuid()
		.primaryKey()
		.references(() => users.id),
	cvFileRef: varchar("cv_file_ref", { length: 1024 }).notNull(),
	...timestamps,
});

export const application = pgTable(
	"Application",
	{
		userId: uuid()
			.references(() => users.id)
			.notNull(),
		jobOfferId: uuid()
			.references(() => jobOffer.id)
			.notNull(),
		resumeId: uuid()
			.references(() => resume.userId)
			.notNull(),
		additionalInfo: text(),
		status: applicationStatusEnum().notNull().default("Sent"),
		additionalResponseInfo: text(),
		...timestamps,
	},
	(t) => [primaryKey({ columns: [t.userId, t.jobOfferId] })],
);
