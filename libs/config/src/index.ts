import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';
import { resolve } from 'path';

try {
  dotenv.config({ path: resolve(process.cwd(), '.env') });
} catch {}

export const config = cleanEnv(process.env, {
  DATABASE_URL: str({
    default: 'postgres://postgres:pgsql@localhost:5432/gm-database',
  }),
});
