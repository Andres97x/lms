import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"
import { env } from "@/data/env/server"

const pool = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  max: 10, //sets limit of concurrent connections
})

// The Next.js Singleton Hack
// This prevents creating a new connection pool every time you save a file in dev mode.
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined
}

const conn = globalForDb.conn ?? pool
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn

export const db = drizzle(conn, { schema })
