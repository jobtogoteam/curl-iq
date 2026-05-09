CREATE TABLE `product_recommendations` (
	`id` text PRIMARY KEY NOT NULL,
	`scan_id` text NOT NULL,
	`user_id` text NOT NULL,
	`product_name` text NOT NULL,
	`brand` text,
	`category` text NOT NULL,
	`key_ingredients` text NOT NULL,
	`reason` text NOT NULL,
	`priority` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`scan_id`) REFERENCES `scans`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `scans` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`image_path` text NOT NULL,
	`wash_state` text,
	`wash_state_confidence` integer,
	`wash_state_reasoning` text,
	`curl_type` text,
	`curl_type_confidence` integer,
	`thickness` text,
	`density` text,
	`porosity` text,
	`health_score` integer,
	`hydration_score` integer,
	`damage_score` integer,
	`frizz_score` integer,
	`definition_score` integer,
	`ai_summary` text,
	`ai_raw_response` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`display_name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);