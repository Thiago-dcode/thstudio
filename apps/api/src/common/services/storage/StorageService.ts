import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { EnumMediaShape, EnumMediaType } from '@database/generated/prisma';
import { imageSize } from 'image-size';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough, Readable } from 'node:stream';
import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
@Injectable()
export abstract class StorageService {
  constructor(protected readonly configService: ConfigService) {}
  abstract getFile(pathToFile: string): Promise<string>;
  abstract getFileBuffer(pathToFile: string): Promise<Buffer>;
  abstract uploadFile(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<boolean>;
  abstract uploadAndGetFile(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<string>;
  abstract deleteFile(pathToFile: string): Promise<boolean>;

  public async optimizeImageToWebp(
    file: Express.Multer.File,
    quality: number = 90,
    targetSize: number = 2 * 1024 * 1024,
  ): Promise<Buffer> {
    //avoid min of 100kb
    const _targetSize = targetSize < 100 * 1024 ? 100 * 1024 : targetSize;
    if (!file.mimetype.startsWith('image/') || file.size < _targetSize)
      return file.buffer;

    const optimizeRecursively = async (
      buffer: Buffer,
      quality: number,
      targetSize: number,
      loops = 0,
    ) => {
      const { width, height } = imageSize(buffer);
      //avoid quality out of range
      const _quality = quality > 100 ? 100 : quality < 10 ? 10 : quality;
      //reduce the image size by 10% each time
      const reduce = 0.9;
      const targetWidth = Math.floor(width * reduce);
      const targetHeight = Math.floor(height * reduce);
      const optimizedBuffer = await sharp(file.buffer)
        .resize({
          width: targetWidth,
          height: targetHeight,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: _quality })
        .toBuffer();

      if (optimizedBuffer.length < targetSize || loops > 5)
        return optimizedBuffer;
      return await optimizeRecursively(
        optimizedBuffer,
        _quality - 5,
        targetSize,
        loops + 1,
      );
    };
    return await optimizeRecursively(file.buffer, quality, _targetSize);
  }
  public async optimizeVideo(file: Express.Multer.File): Promise<Buffer> {
    throw new Error('Not working');
    // const metadata = await this.getVideoMetadata(file);
    return new Promise((resolve, reject) => {
      const bufferStream = new PassThrough();
      const buffers = [];
      bufferStream.on('data', function (buf) {
        buffers.push(buf);
      });
      bufferStream.on('end', function () {
        const outputBuffer = Buffer.concat(buffers);
        resolve(outputBuffer);
      });
      ffmpeg(Readable.from(file.buffer))
        .videoCodec('libx264')
        .size(`1280x720`)
        .on('error', (err) => {
          console.error('Error:', err.message);
          reject(err);
        })
        .writeToStream(bufferStream);
    });
  }
  public async getVideoMetadata(file: Express.Multer.File): Promise<{
    width: number;
    height: number;
    bitrate: number;
    duration: number;
    frameRate: number;
  } | null> {
    throw new Error('Not working');
    if (!file.mimetype.startsWith('video/')) return undefined;
    const tempPath = path.join(__dirname, 'temp');
    if (!existsSync(tempPath)) {
      mkdirSync(tempPath);
    }
    const tempFilePath = path.join(tempPath, 'temp.mp4');
    await writeFile(tempFilePath, file.buffer);
    const result = await new Promise<{
      width: number;
      height: number;
      bitrate: number;
      duration: number;
      frameRate: number;
    } | null>(async (resolve, reject) => {
      ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
        if (err) {
          console.error('Error getting video metadata:', err);
          resolve(null);
        } else {
          if (!metadata?.streams?.[0]) {
            resolve(null);
          } else {
            const result = {
              width: metadata.streams[0].width,
              height: metadata.streams[0].height,
              bitrate: Number(metadata.streams[0].bit_rate),
              duration: Number(metadata.streams[0].duration),
              frameRate: Number(metadata.streams[0].r_frame_rate.split('/')[0]),
            };

            resolve(result);
          }
        }
      });
    });
    await unlink(tempFilePath);
    return result;
  }
  public getType(file: Express.Multer.File): EnumMediaType | undefined {
    if (file.mimetype.startsWith('image/')) {
      return EnumMediaType.IMAGE;
    }
    if (file.mimetype.startsWith('video/')) {
      return EnumMediaType.VIDEO;
    }
    return undefined;
  }
  public getShape(file: Express.Multer.File): EnumMediaShape | undefined {
    if (file.mimetype.startsWith('image/')) {
      const size = imageSize(file.buffer);
      const ratio = size.width / size.height;

      if (size.width > size.height) {
        return ratio >= 2
          ? EnumMediaShape.LANDSCAPE_LARGE
          : EnumMediaShape.LANDSCAPE;
      } else if (size.width < size.height) {
        return ratio <= 0.5
          ? EnumMediaShape.PORTRAIT_LARGE
          : EnumMediaShape.PORTRAIT;
      }
      return EnumMediaShape.SQUARE;
    }
    if (file.mimetype.startsWith('video/')) {
    }
    return undefined;
  }

  public async addWatermark(
    fileToAddWatermark: Buffer | string,
    watermark: Buffer | string,
  ): Promise<Buffer> {
    let fileToAddWatermarkBuffer: Buffer;
    let watermarkBuffer: Buffer;

    if (typeof fileToAddWatermark === 'string') {
      fileToAddWatermarkBuffer = await this.getFileBuffer(fileToAddWatermark);
    } else {
      fileToAddWatermarkBuffer = fileToAddWatermark;
    }
    if (typeof watermark === 'string') {
      watermarkBuffer = await this.getFileBuffer(watermark);
    } else {
      watermarkBuffer = watermark;
    }

    const size = imageSize(fileToAddWatermarkBuffer);
    const watermarkBufferResized = await sharp(watermarkBuffer)
      .resize(Math.round(size.width * 0.2))
      .toBuffer();

    const result = sharp(fileToAddWatermarkBuffer)
      .composite([
        {
          input: watermarkBufferResized,
          gravity: 'southeast',
          blend: 'over',
        },
      ])
      .toBuffer();

    return result;
  }
}
