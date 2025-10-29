CREATE TABLE "opinions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"hotel_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "opinions_user_id_hotel_id_unique" UNIQUE("user_id","hotel_id")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "special_info" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "days_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "guests" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "all-inclusive" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "total-price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "imageUrl" text;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "total_rating" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "rating_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "guests" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(10) DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "opinions" ADD CONSTRAINT "opinions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opinions" ADD CONSTRAINT "opinions_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";