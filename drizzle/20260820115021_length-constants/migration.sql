ALTER TABLE "CandidateExperience" DROP CONSTRAINT "CandidateExperience_pkey";--> statement-breakpoint
ALTER TABLE "CandidateExperience" ADD PRIMARY KEY ("userId","company_name");--> statement-breakpoint
ALTER TABLE "Application" ALTER COLUMN "additionalInfo" SET DATA TYPE varchar(16536) USING "additionalInfo"::varchar(16536);--> statement-breakpoint
ALTER TABLE "Application" ALTER COLUMN "additionalResponseInfo" SET DATA TYPE varchar(16536) USING "additionalResponseInfo"::varchar(16536);--> statement-breakpoint
ALTER TABLE "CandidateExperience" ALTER COLUMN "description" SET DATA TYPE varchar(16536) USING "description"::varchar(16536);--> statement-breakpoint
ALTER TABLE "CandidateProject" ALTER COLUMN "description" SET DATA TYPE varchar(16536) USING "description"::varchar(16536);