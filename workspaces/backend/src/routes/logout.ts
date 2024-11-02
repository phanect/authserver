import { Hono } from "hono";
import { lucia } from "../lib/auth.ts";

import type { Context } from "../lib/types.ts";

export const logoutRouter = new Hono<Context>();

logoutRouter.post("/", async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.body(null, 401);
  }
  await lucia.invalidateSession(session.id);
  c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), { append: true });
  return c.redirect("/login");
});
