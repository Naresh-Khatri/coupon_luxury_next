import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import { env } from "./lib/env";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL.replace("-pooler", "") },
  schemaFilter: ["public"],
  strict: true,
});
