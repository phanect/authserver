import { Hono } from "hono";
import { middleware } from "./middleware.ts";
import { ui } from "./ui.tsx";
import { google } from "./google.ts";
import { github } from "./github.ts";

import type { IcedGateEnv } from "../libs/types.ts";

export const icedgate = new Hono<IcedGateEnv>()
  .use(middleware)
  .route("/", ui)
  .route("/", google)
  .route("/", github);
