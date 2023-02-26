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
  S3_BUCKET_NAME_SOUNDS: str({
    default: 'beherit-bucket-s',
  }),
  S3_BUCKET_NAME_AVATAR: str({
    default: 'beherit-bucket-a',
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
  JWT_RECOVERY_SECRET_KEY: str({
    default: 'recovery_$ecret',
  }),
  SECRET_COOKIES_KEY: str({
    default: '$ecret_cookies_key',
  }),
  MAILER_TRANSPORT: str({
    default: 'smtps://user@domain.com:pass@smtp.domain.com',
  }),
});
