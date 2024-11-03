import { env } from "hono/adapter";
import type { Context } from "hono";
import type { Env } from "./lib/types.ts";

export const isLocal = (context: Context<Env>): boolean => {
  const { SERVER_ENV: serverEnv } = env(context);

  return serverEnv === "development" || serverEnv === "local";
};
