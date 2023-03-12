import s3Stream from 'aws-sdk';
import { config } from '@beherit/config';

export const s3 = new s3Stream.S3({
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  endpoint: new s3Stream.Endpoint(config.S3_ENDPOINT),
  s3ForcePathStyle: true,
  signatureVersion: config.S3_SIGNATURE_VERSION,
});
