PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_IcewallUserProps` (
	`name` text,
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `IcewallUsers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_IcewallUserProps`("name", "id", "userId") SELECT "name", "id", "userId" FROM `IcewallUserProps`;--> statement-breakpoint
DROP TABLE `IcewallUserProps`;--> statement-breakpoint
ALTER TABLE `__new_IcewallUserProps` RENAME TO `IcewallUserProps`;--> statement-breakpoint
PRAGMA foreign_keys=ON;