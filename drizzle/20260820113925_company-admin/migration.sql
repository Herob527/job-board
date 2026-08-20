CREATE TABLE "CompanyAdmin" (
	"id" uuid PRIMARY KEY,
	"companyId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "CompanyAdmin" ADD CONSTRAINT "CompanyAdmin_id_User_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "CompanyAdmin" ADD CONSTRAINT "CompanyAdmin_companyId_Company_id_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id");