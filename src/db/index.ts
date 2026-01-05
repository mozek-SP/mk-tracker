import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connection string จาก .env
const connectionString = process.env.DATABASE_URL!;

// สำหรับเครื่องมือที่รันแบบ Serverless (Next.js)
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
