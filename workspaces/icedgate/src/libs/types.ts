import type { Env } from "hono";
import type { User, Session } from "./index.ts";

export type Context = {
  Variables: {
    user?: User;
    session?: Session;
  };
} & Env;
