ALTER TABLE "JobOffer" ALTER COLUMN "description" SET DATA TYPE varchar(16536) USING "description"::varchar(16536);--> statement-breakpoint
ALTER TABLE "CandidateExperience" ADD CONSTRAINT "CandidateExperience_userId_company_name_startDate_unique" UNIQUE("userId","company_name","startDate");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE("email");