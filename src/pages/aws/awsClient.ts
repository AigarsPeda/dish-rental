import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";

export const s3 = new S3Client({
  credentials: {
    accessKeyId: env.ACCESS_KEY_AWS,
    secretAccessKey: env.SECRET_AWS,
  },
  region: env.REGION_AWS,
});
