import { integer, table, text } from "../dbms.ts";
import type { InferSelectModel } from "drizzle-orm";

export const IcedGateUsers = table("IcedGateUsers", {
  id: text().primaryKey(),
  username: text().unique().notNull(),
  googleId: integer().unique(),
  githubId: integer().unique(),
});

export type IcedGateUser = InferSelectModel<typeof IcedGateUsers>;
