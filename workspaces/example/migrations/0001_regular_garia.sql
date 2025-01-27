CREATE TABLE `IcewallUserProps` (
	`name` text,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text,
	FOREIGN KEY (`userId`) REFERENCES `IcewallUsers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_IcewallUsers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`githubId` integer,
	`githubDisplayId` text
);
--> statement-breakpoint
INSERT INTO `__new_IcewallUsers`("id", "email", "githubId", "githubDisplayId") SELECT "id", "email", "githubId", "githubDisplayId" FROM `IcewallUsers`;--> statement-breakpoint
DROP TABLE `IcewallUsers`;--> statement-breakpoint
ALTER TABLE `__new_IcewallUsers` RENAME TO `IcewallUsers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `IcewallUsers_email_unique` ON `IcewallUsers` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `IcewallUsers_githubId_unique` ON `IcewallUsers` (`githubId`);--> statement-breakpoint
CREATE UNIQUE INDEX `IcewallUsers_githubDisplayId_unique` ON `IcewallUsers` (`githubDisplayId`);--> statement-breakpoint
CREATE TABLE `__new_IcewallSessions` (
	`id` text PRIMARY KEY NOT NULL,
	`fresh` integer DEFAULT true,
	`expiresAt` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `IcewallUsers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_IcewallSessions`("id", "fresh", "expiresAt", "userId") SELECT "id", "fresh", "expiresAt", "userId" FROM `IcewallSessions`;--> statement-breakpoint
DROP TABLE `IcewallSessions`;--> statement-breakpoint
ALTER TABLE `__new_IcewallSessions` RENAME TO `IcewallSessions`;