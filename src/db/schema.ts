import { sql } from "drizzle-orm";
import {
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
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
export const corporateRoleEnum = pgEnum("corporate_role", [
  "company_admin",
  "recruiter",
]);

export const roleEnum = pgEnum("role", [
  "candidate",
  "corporate",
  "platform_admin",
]);

const stringSizes = {
  short: 255,
  url: 1024,
  currency: 3,
  markdown: 16536,
} as const;

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable("User", {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  name: varchar("name", { length: stringSizes.short }).notNull(),
  surname: varchar("surname", { length: stringSizes.short }),
  country: varchar("country", { length: stringSizes.short }),
  email: varchar("email", { length: stringSizes.short }).notNull().unique(),
  password: varchar("password", { length: stringSizes.short }).notNull(),
  roles: roleEnum().array().notNull().default(sql`'{}'::role[]`),
  ...timestamps,
});

export const candidateSkill = pgTable(
  "CandidateSkill",
  {
    userId: uuid()
      .references(() => users.id)
      .notNull(),
    name: varchar("name", { length: stringSizes.short }).notNull(),
    seniority: seniorityEnum().notNull(),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.userId, t.name] })],
);

export const candidateExperience = pgTable(
  "CandidateExperience",
  {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    userId: uuid()
      .references(() => users.id)
      .notNull(),
    companyName: varchar("company_name", {
      length: stringSizes.short,
    }).notNull(),
    startDate: date().notNull(),
    endDate: date(),
    description: varchar({ length: stringSizes.markdown }).notNull(),
    stack: text().array().notNull().default(sql`'{}'`),
    ...timestamps,
  },
  (t) => [unique().on(t.userId, t.companyName, t.startDate)],
);

export const candidateProject = pgTable("CandidateProject", {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  userId: uuid()
    .references(() => users.id)
    .notNull(),
  link: varchar("link", { length: stringSizes.url }),
  description: varchar({ length: stringSizes.markdown }).notNull(),
  stack: text().array().notNull().default(sql`'{}'`),
  ...timestamps,
});

export const company = pgTable("Company", {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  name: varchar("name", { length: stringSizes.short }).notNull().unique(),
  location: text().array().notNull().default(sql`'{}'`),
  ...timestamps,
});

export const corporateMembership = pgTable(
  "CorporateMembership",
  {
    userId: uuid()
      .references(() => users.id)
      .notNull(),
    companyId: uuid()
      .references(() => company.id)
      .notNull(),
    subRoles: corporateRoleEnum()
      .array()
      .notNull()
      .default(sql`'{}'::corporate_role[]`),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.userId, t.companyId] })],
);

export const jobOffer = pgTable(
  "JobOffer",
  {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    companyId: uuid()
      .references(() => company.id)
      .notNull(),
    title: varchar("title", { length: stringSizes.short }).notNull(),
    description: varchar({ length: stringSizes.markdown }).notNull(),
    remoteType: remoteTypeEnum()
      .array()
      .notNull()
      .default(sql`'{}'::remote_type[]`),
    minSalary: integer(),
    maxSalary: integer(),
    currency: varchar("currency", { length: stringSizes.currency }),
    employmentType: employmentTypeEnum()
      .array()
      .notNull()
      .default(sql`'{}'::employment_type[]`),
    seniority: seniorityEnum()
      .array()
      .notNull()
      .default(sql`'{}'::seniority[]`),
    location: text().array().notNull().default(sql`'{}'`),
    ...timestamps,
  },
  (t) => [check("salaryCheck", sql`${t.minSalary} < ${t.maxSalary}`)],
);

export const jobOfferSkill = pgTable(
  "JobOfferSkill",
  {
    jobOfferId: uuid()
      .references(() => jobOffer.id)
      .notNull(),
    name: varchar("name", { length: stringSizes.short }).notNull(),
    seniority: seniorityEnum().notNull(),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.jobOfferId, t.name] })],
);

export const resume = pgTable("Resume", {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  userId: uuid().references(() => users.id),
  cvFileRef: varchar("cv_file_ref", { length: stringSizes.url }).notNull(),
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
      .references(() => resume.id)
      .notNull(),
    additionalInfo: varchar({ length: stringSizes.markdown }),
    status: applicationStatusEnum()
      .notNull()
      .default(applicationStatusEnum.enumValues[0]),
    additionalResponseInfo: varchar({ length: stringSizes.markdown }),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.userId, t.jobOfferId] })],
);
