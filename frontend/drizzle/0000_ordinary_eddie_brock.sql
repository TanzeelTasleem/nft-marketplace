CREATE TABLE IF NOT EXISTS "crypto_address_orm" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_orm" (
	"id" integer PRIMARY KEY NOT NULL,
	"display_name" text,
	"username" text,
	"email" text,
	"secretText" text,
	"profile_image" text,
	"cover_image" text,
	"bio" text,
	"emailVerified" boolean,
	"nonce" text,
	"publicAddress" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailIdx" ON "user_orm" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "secretTextIdx" ON "user_orm" ("secretText");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "nonceIdx" ON "user_orm" ("nonce");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "publicAddressIdx" ON "user_orm" ("publicAddress");