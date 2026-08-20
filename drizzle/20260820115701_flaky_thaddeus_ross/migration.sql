ALTER TABLE "CandidateExperience" ADD COLUMN "id" uuid DEFAULT uuidv7();--> statement-breakpoint
ALTER TABLE "CandidateExperience" DROP CONSTRAINT "CandidateExperience_pkey";--> statement-breakpoint
ALTER TABLE "CandidateExperience" ADD PRIMARY KEY ("id");