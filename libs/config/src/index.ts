import { bool, cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';
import { resolve } from 'path';

try {
  dotenv.config({ path: resolve(process.cwd(), '.env') });
} catch {}

export const config = cleanEnv(process.env, {
  DATABASE_URL: str({
    default: 'postgres://postgres:pgsql@localhost:5432/gm-database',
  }),
  S3_BUCKET_NAME: str({
    default: 'beherit',
  }),
  S3_ACCESS_KEY_ID: str({
    default: 'KEY_ID',
  }),
  S3_SECRET_ACCESS_KEY: str({
    default: 'SECRET_KEY',
  }),
  S3_ENDPOINT: str({
    default: 'http://localhost:9000/',
  }),
  S3_FORCE_PATH_STYLE: bool({
    default: true,
  }),
  S3_SIGNATURE_VERSION: str({
    default: 'v4',
  }),
  JWT_SECRET_KEY: str({
    default: '$ecret',
  }),
  JWT_REFRESH_SECRET_KEY: str({
    default: 'refre$h_$ecret',
  }),
  SECRET_COOKIES_KEY: str({
    default: '$ecret_cookies_key',
  }),
});
