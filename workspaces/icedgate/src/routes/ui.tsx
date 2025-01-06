import { Hono } from "hono";

import type { IcedGateEnv } from "../libs/types.ts";

export const ui = new Hono<IcedGateEnv>()
  .get("/login", async (c) => {
    const session = c.get("session");
    if (session) {
      return c.redirect("/");
    }
    return c.html((
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <title>Login or Sign up</title>
        </head>
        <body>
          <h1>Login or Sign up</h1>
          <a href="/login/google">Login or sign up with Google</a> <br />
          <a href="/login/github">Login or sign up with GitHub</a>
        </body>
      </html>
    ), 200);
  }).post("/", async (c) => {
    const lucia = c.get("lucia");
    const session = c.get("session");
    if (!session) {
      return c.body(null, 401);
    }
    await lucia.invalidateSession(session.id);
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), { append: true });
    return c.redirect("/login");
  });
