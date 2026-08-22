CREATE TYPE "application_status" AS ENUM('Sent', 'Seen', 'Interested', 'Hired', 'Rejected');--> statement-breakpoint
CREATE TYPE "corporate_role" AS ENUM('company_admin', 'recruiter');--> statement-breakpoint
CREATE TYPE "employment_type" AS ENUM('Employment Contact', 'B2B', 'Mandate');--> statement-breakpoint
CREATE TYPE "remote_type" AS ENUM('Office', 'Hybrid', 'Remote');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('candidate', 'corporate', 'platform_admin');--> statement-breakpoint
CREATE TYPE "seniority" AS ENUM('Junior', 'Mid', 'Senior');--> statement-breakpoint
CREATE TABLE "Application" (
	"userId" uuid,
	"jobOfferId" uuid,
	"resumeId" uuid NOT NULL,
	"additionalInfo" varchar(16536),
	"status" "application_status" DEFAULT 'Sent'::"application_status" NOT NULL,
	"additionalResponseInfo" varchar(16536),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Application_pkey" PRIMARY KEY("userId","jobOfferId")
);
--> statement-breakpoint
CREATE TABLE "CandidateExperience" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"userId" uuid NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date,
	"description" varchar(16536) NOT NULL,
	"stack" text[] DEFAULT '{}'::text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "CandidateExperience_userId_company_name_startDate_unique" UNIQUE("userId","company_name","startDate")
);
--> statement-breakpoint
CREATE TABLE "CandidateProject" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"userId" uuid NOT NULL,
	"link" varchar(1024),
	"description" varchar(16536) NOT NULL,
	"stack" text[] DEFAULT '{}'::text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "CandidateSkill" (
	"userId" uuid,
	"name" varchar(255),
	"seniority" "seniority" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "CandidateSkill_pkey" PRIMARY KEY("userId","name")
);
--> statement-breakpoint
CREATE TABLE "Company" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" varchar(255) NOT NULL UNIQUE,
	"location" text[] DEFAULT '{}'::text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "CorporateMembership" (
	"userId" uuid,
	"companyId" uuid,
	"subRoles" "corporate_role"[] DEFAULT '{}'::"corporate_role"[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "CorporateMembership_pkey" PRIMARY KEY("userId","companyId")
);
--> statement-breakpoint
CREATE TABLE "JobOffer" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"companyId" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(16536) NOT NULL,
	"remoteType" "remote_type"[] DEFAULT '{}'::"remote_type"[] NOT NULL,
	"minSalary" integer,
	"maxSalary" integer,
	"currency" varchar(3),
	"employmentType" "employment_type"[] DEFAULT '{}'::"employment_type"[] NOT NULL,
	"seniority" "seniority"[] DEFAULT '{}'::"seniority"[] NOT NULL,
	"location" text[] DEFAULT '{}'::text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "salaryCheck" CHECK ("minSalary" < "maxSalary")
);
--> statement-breakpoint
CREATE TABLE "JobOfferSkill" (
	"jobOfferId" uuid,
	"name" varchar(255),
	"seniority" "seniority" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "JobOfferSkill_pkey" PRIMARY KEY("jobOfferId","name")
);
--> statement-breakpoint
CREATE TABLE "Resume" (
	"userId" uuid PRIMARY KEY,
	"cv_file_ref" varchar(1024) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" varchar(255) NOT NULL,
	"surname" varchar(255),
	"country" varchar(255),
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"roles" "role"[] DEFAULT '{}'::"role"[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobOfferId_JobOffer_id_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "JobOffer"("id");--> statement-breakpoint
ALTER TABLE "Application" ADD CONSTRAINT "Application_resumeId_Resume_userId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("userId");--> statement-breakpoint
ALTER TABLE "CandidateExperience" ADD CONSTRAINT "CandidateExperience_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "CandidateProject" ADD CONSTRAINT "CandidateProject_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "CandidateSkill" ADD CONSTRAINT "CandidateSkill_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "CorporateMembership" ADD CONSTRAINT "CorporateMembership_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "CorporateMembership" ADD CONSTRAINT "CorporateMembership_companyId_Company_id_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id");--> statement-breakpoint
ALTER TABLE "JobOffer" ADD CONSTRAINT "JobOffer_companyId_Company_id_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id");--> statement-breakpoint
ALTER TABLE "JobOfferSkill" ADD CONSTRAINT "JobOfferSkill_jobOfferId_JobOffer_id_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "JobOffer"("id");--> statement-breakpoint
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");