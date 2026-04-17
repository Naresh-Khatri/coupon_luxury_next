CREATE TABLE "offer_click" (
	"id" serial PRIMARY KEY NOT NULL,
	"offerId" integer NOT NULL,
	"country" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "offer" ADD COLUMN "uses" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "offer_click" ADD CONSTRAINT "offer_click_offerId_offer_id_fk" FOREIGN KEY ("offerId") REFERENCES "public"."offer"("id") ON DELETE cascade ON UPDATE no action;