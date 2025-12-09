CREATE TABLE "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"image" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name"),
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cuisine" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"image" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cuisine_name_unique" UNIQUE("name"),
	CONSTRAINT "cuisine_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"content" text,
	"prep_time" integer NOT NULL,
	"cook_time" integer NOT NULL,
	"total_time" integer NOT NULL,
	"servings" integer NOT NULL,
	"difficulty" varchar(20) NOT NULL,
	"dietary_type" varchar(20) DEFAULT 'non-vegetarian',
	"featured_image" text,
	"video_url" text,
	"author_id" text NOT NULL,
	"category_id" integer,
	"cuisine_id" integer,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_draft" boolean DEFAULT true NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"ratings_count" integer DEFAULT 0 NOT NULL,
	"average_rating" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "recipe_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "recipe_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"caption" text,
	"width" integer,
	"height" integer,
	"file_size" integer,
	"mime_type" varchar(50),
	"sort_order" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredient" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"group_name" varchar(100),
	"group_order" integer DEFAULT 0,
	"name" varchar(255) NOT NULL,
	"amount" varchar(50),
	"unit" varchar(50),
	"preparation" varchar(100),
	"notes" text,
	"item_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_instruction" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"step_number" integer NOT NULL,
	"title" varchar(200),
	"content" text NOT NULL,
	"image" text,
	"video_url" text,
	"estimated_time" integer,
	"temperature" varchar(50),
	"tips" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_like" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"review" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_tip" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"content" text NOT NULL,
	"category" varchar(50),
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"description" text,
	"color" varchar(7),
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tag_name_unique" UNIQUE("name"),
	CONSTRAINT "tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"age" integer,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"email" text,
	"first_name" text,
	"last_name" text,
	"bio" text,
	"profile_image" text,
	"location" text,
	"website" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_cuisine_id_cuisine_id_fk" FOREIGN KEY ("cuisine_id") REFERENCES "public"."cuisine"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_image" ADD CONSTRAINT "recipe_image_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_instruction" ADD CONSTRAINT "recipe_instruction_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_like" ADD CONSTRAINT "recipe_like_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_like" ADD CONSTRAINT "recipe_like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_rating" ADD CONSTRAINT "recipe_rating_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_rating" ADD CONSTRAINT "recipe_rating_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tag" ADD CONSTRAINT "recipe_tag_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tag" ADD CONSTRAINT "recipe_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tip" ADD CONSTRAINT "recipe_tip_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_slug_idx" ON "category" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "category_active_idx" ON "category" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "cuisine_slug_idx" ON "cuisine" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cuisine_active_idx" ON "cuisine" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "recipe_slug_idx" ON "recipe" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "recipe_author_idx" ON "recipe" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "recipe_category_idx" ON "recipe" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "recipe_cuisine_idx" ON "recipe" USING btree ("cuisine_id");--> statement-breakpoint
CREATE INDEX "recipe_published_idx" ON "recipe" USING btree ("is_published","published_at");--> statement-breakpoint
CREATE INDEX "recipe_popular_idx" ON "recipe" USING btree ("likes_count","average_rating");--> statement-breakpoint
CREATE INDEX "recipe_search_idx" ON "recipe" USING btree ("title","description");--> statement-breakpoint
CREATE INDEX "image_recipe_idx" ON "recipe_image" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "image_order_idx" ON "recipe_image" USING btree ("recipe_id","sort_order");--> statement-breakpoint
CREATE INDEX "ingredient_recipe_idx" ON "recipe_ingredient" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "ingredient_order_idx" ON "recipe_ingredient" USING btree ("recipe_id","group_order","item_order");--> statement-breakpoint
CREATE INDEX "instruction_recipe_idx" ON "recipe_instruction" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "instruction_step_idx" ON "recipe_instruction" USING btree ("recipe_id","step_number");--> statement-breakpoint
CREATE INDEX "like_recipe_idx" ON "recipe_like" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "like_user_idx" ON "recipe_like" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "like_unique_idx" ON "recipe_like" USING btree ("recipe_id","user_id");--> statement-breakpoint
CREATE INDEX "rating_recipe_idx" ON "recipe_rating" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "rating_user_idx" ON "recipe_rating" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rating_value_idx" ON "recipe_rating" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "rating_unique_idx" ON "recipe_rating" USING btree ("recipe_id","user_id");--> statement-breakpoint
CREATE INDEX "recipe_tag_recipe_idx" ON "recipe_tag" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipe_tag_tag_idx" ON "recipe_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "recipe_tag_unique_idx" ON "recipe_tag" USING btree ("recipe_id","tag_id");--> statement-breakpoint
CREATE INDEX "tip_recipe_idx" ON "recipe_tip" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "tip_order_idx" ON "recipe_tip" USING btree ("recipe_id","sort_order");--> statement-breakpoint
CREATE INDEX "tag_slug_idx" ON "tag" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tag_popular_idx" ON "tag" USING btree ("usage_count");