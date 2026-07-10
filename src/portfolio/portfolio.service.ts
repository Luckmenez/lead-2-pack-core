import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

const KEY_PATTERN = /^portfolio\/(fornecedor|profissional)\/([^/]+)\//;

@Injectable()
export class PortfolioService {
  private readonly s3 = new S3Client({
    region: process.env.APP_AWS_REGION,
    credentials: {
      accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
    },
  });

  private readonly bucket = process.env.APP_AWS_BUCKET_NAME!;

  private get publicUrlPrefix() {
    return `https://${this.bucket}.s3.${process.env.APP_AWS_REGION}.amazonaws.com/`;
  }

  async getUploadUrl(
    filename: string,
    contentType: string,
    userType: string,
    userId: string,
  ) {
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `portfolio/${userType}/${userId}/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60,
    });

    return { presignedUrl, publicUrl: `${this.publicUrlPrefix}${key}` };
  }

  async getDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, command, { expiresIn: 300 });
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  parseKeyFromPublicUrl(publicUrl: string): string | null {
    if (!publicUrl.startsWith(this.publicUrlPrefix)) return null;
    return decodeURIComponent(publicUrl.slice(this.publicUrlPrefix.length));
  }

  canAccess(user: JwtPayload, key: string): boolean {
    const match = key.match(KEY_PATTERN);
    if (!match) return false;
    if (user.tipo === 'comprador') return true;
    const [, userType, userId] = match;
    return user.tipo === userType && user.sub === userId;
  }

  canDelete(user: JwtPayload, key: string): boolean {
    const match = key.match(KEY_PATTERN);
    if (!match) return false;
    const [, userType, userId] = match;
    return user.tipo === userType && user.sub === userId;
  }
}
