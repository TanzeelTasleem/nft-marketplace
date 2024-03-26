// import * as schema from "../../db/schema";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
// import { sql } from "@vercel/postgres";
// export const db = drizzle(sql);


const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
