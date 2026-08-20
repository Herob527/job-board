CREATE TYPE "application_status" AS ENUM('Sent', 'Seen', 'Interested', 'Hired', 'Rejected');--> statement-breakpoint
CREATE TYPE "employment_type" AS ENUM('Employment Contact', 'B2B', 'Mandate');--> statement-breakpoint
CREATE TYPE "remote_type" AS ENUM('Office', 'Hybrid', 'Remote');--> statement-breakpoint
CREATE TYPE "seniority" AS ENUM('Junior', 'Mid', 'Senior');--> statement-breakpoint
CREATE TABLE "Application" (
	"userId" uuid,
	"jobOfferId" uuid,
	"resumeId" uuid NOT NULL,
	"additionalInfo" text,
	"status" "application_status" DEFAULT 'Sent'::"application_status" NOT NULL,
	"additionalResponseInfo" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Application_pkey" PRIMARY KEY("userId","jobOfferId")
);
--> statement-breakpoint
CREATE TABLE "Candidate" (
	"id" uuid PRIMARY KEY,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "CandidateExperience" (
	"userId" uuid,
	"company_name" varchar(255),
	"startDate" date,
	"endDate" date,
	"description" text NOT NULL,
	"stack" text[] DEFAULT '{}'::text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "CandidateExperience_pkey" PRIMARY KEY("userId","company_name","startDate")
);
--> statement-breakpoint
CREATE TABLE "CandidateProject" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"userId" uuid NOT NULL,
	"link" varchar(1024),
	"description" text NOT NULL,
	"stack" text[] DEFAULT '{}'::text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "CandidateProjectStackItem" (
	"candidateProjectId" uuid,
	"name" varchar(255),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "CandidateProjectStackItem_pkey" PRIMARY KEY("candidateProjectId","name")
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
	"name" varchar(255) NOT NULL,
	"location" text[] DEFAULT '{}'::text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "JobOffer" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"remoteType" "remote_type"[] DEFAULT '{}'::"remote_type"[] NOT NULL,
	"minSalary" integer,
	"maxSalary" integer,
	"currency" varchar(16),
	"employmentType" "employment_type"[] DEFAULT '{}'::"employment_type"[] NOT NULL,
	"seniority" "seniority"[] DEFAULT '{}'::"seniority"[] NOT NULL,
	"location" text[] DEFAULT '{}'::text[] NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
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
CREATE TABLE "Recruiter" (
	"id" uuid PRIMARY KEY,
	"companyId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Resume" (
	"userId" uuid PRIMARY KEY,
	"cv_file_ref" varchar(1024) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" RENAME TO "User";--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobOfferId_JobOffer_id_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "JobOffer"("id");--> statement-breakpoint
ALTER TABLE "Application" ADD CONSTRAINT "Application_resumeId_Resume_userId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("userId");--> statement-breakpoint
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_id_User_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "CandidateExperience" ADD CONSTRAINT "CandidateExperience_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "CandidateProject" ADD CONSTRAINT "CandidateProject_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "CandidateProjectStackItem" ADD CONSTRAINT "CandidateProjectStackItem_8IV5SRth8x3I_fkey" FOREIGN KEY ("candidateProjectId") REFERENCES "CandidateProject"("id");--> statement-breakpoint
ALTER TABLE "CandidateSkill" ADD CONSTRAINT "CandidateSkill_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "JobOfferSkill" ADD CONSTRAINT "JobOfferSkill_jobOfferId_JobOffer_id_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "JobOffer"("id");--> statement-breakpoint
ALTER TABLE "Recruiter" ADD CONSTRAINT "Recruiter_id_User_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "Recruiter" ADD CONSTRAINT "Recruiter_companyId_Company_id_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id");--> statement-breakpoint
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");