CREATE TABLE "PlatformAdmin" (
	"id" uuid PRIMARY KEY,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "PlatformAdmin" ADD CONSTRAINT "PlatformAdmin_id_User_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id");