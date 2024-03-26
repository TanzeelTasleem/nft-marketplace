CREATE TABLE IF NOT EXISTS "wallt_orm" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "crypto_address_orm" RENAME COLUMN "type" TO "address";--> statement-breakpoint
ALTER TABLE "crypto_address_orm" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "crypto_address_orm" ADD COLUMN "wallet_id" integer;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "addressIdx" ON "crypto_address_orm" ("address");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crypto_address_orm" ADD CONSTRAINT "crypto_address_orm_user_id_user_orm_id_fk" FOREIGN KEY ("user_id") REFERENCES "user_orm"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "crypto_address_orm" ADD CONSTRAINT "crypto_address_orm_wallet_id_wallt_orm_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "wallt_orm"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
