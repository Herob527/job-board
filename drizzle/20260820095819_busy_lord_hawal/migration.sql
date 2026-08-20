CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" varchar(255) NOT NULL,
	"surname" varchar(255),
	"country" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL
);
