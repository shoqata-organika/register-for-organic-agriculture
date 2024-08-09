import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

enum AWS {
  BUCKET_NAME = 'AWS_BUCKET_NAME',
  BUCKET_REGION = 'AWS_BUCKET_REGION',
  ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
}

@Injectable()
export class AWS3 {
  private _isProd: boolean =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
  private _bucket: string;
  private _region: string;
  private _accessKeyId: string;
  private _secretAccessKey: string;
  private _s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    if (this._isProd) {
      this._bucket = process.env[AWS.BUCKET_NAME];
      this._region = process.env[AWS.BUCKET_REGION];
      this._accessKeyId = process.env[AWS.ACCESS_KEY_ID];
      this._secretAccessKey = process.env[AWS.SECRET_ACCESS_KEY];
    } else {
      this._bucket = this.configService.get(AWS.BUCKET_NAME);
      this._region = this.configService.get(AWS.BUCKET_REGION);
      this._accessKeyId = this.configService.get(AWS.ACCESS_KEY_ID);
      this._secretAccessKey = this.configService.get(AWS.SECRET_ACCESS_KEY);
    }

    this._s3 = new S3Client({
      credentials: {
        accessKeyId: this._accessKeyId,
        secretAccessKey: this._secretAccessKey,
      },
      region: this._region,
    });
  }

  public async uploadFile(file: Express.Multer.File, existingName?: string) {
    const { buffer, mimetype } = file;

    const fileName = existingName
      ? existingName
      : encodeURIComponent(this._formatName(uuidv4()));

    return await this._uploadToS3(fileName, buffer, mimetype);
  }

  public async deleteFile(name: string) {
    return await this._deleteS3Object(name);
  }

  private _formatName(name: string): string {
    return `${new Date().getTime()}_${name}`;
  }

  private async _uploadToS3(name: string, buffer: Buffer, mimetype: string) {
    try {
      const response = await this._s3.send(
        new PutObjectCommand({
          Bucket: this._bucket,
          Body: buffer,
          Key: name,
          ContentType: mimetype,
          ACL: 'public-read',
        }),
      );

      const data = await Promise.resolve(response)
        .then(() => {
          const url = `https://${this._bucket}.s3.${this._region}.amazonaws.com/${name}`;

          return url;
        })
        .catch((error) => {
          console.error(error);

          return undefined;
        });

      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Couldn't save your file, please try again");
    }
  }

  private async _deleteS3Object(name: string) {
    try {
      const response = await this._s3.send(
        new DeleteObjectCommand({
          Bucket: this._bucket,
          Key: name,
        }),
      );

      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong while trying to delete file');
    }
  }

  public getFileName(fileUrl?: string): string {
    if (!fileUrl) return;

    const parts = fileUrl.split('/');

    return parts[parts.length - 1];
  }
}
