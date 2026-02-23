import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class MediaService {
  private useCloudinary = false;
  private readonly logger = new Logger(MediaService.name);

  constructor(private config: ConfigService) {
    const cloudName = this.config.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.useCloudinary = true;
      this.logger.log('Cloudinary storage enabled');
    } else {
      this.logger.warn('Cloudinary credentials missing. Falling back to local disk storage in /uploads');
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    }
  }

  async upload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Fayl seçilməyib');

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) throw new BadRequestException('Fayl 5MB-dan böyükdür');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Yalnız JPG, PNG, WebP, GIF formatları');
    }

    if (this.useCloudinary) {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'kutlewe', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            resolve({ url: result?.secure_url, publicId: result?.public_id });
          },
        ).end(file.buffer);
      });
    } else {
      // Local fallback
      const ext = path.extname(file.originalname) || `.${file.mimetype.split('/')[1]}`;
      const uniqueName = `${crypto.randomBytes(16).toString('hex')}${ext}`;
      const uploadPath = path.join(process.cwd(), 'uploads', uniqueName);

      await fs.promises.writeFile(uploadPath, file.buffer);

      const apiUrl = this.config.get('NEXT_PUBLIC_API_URL') || 'http://localhost:4000/api/v1';
      // URL is served statically by ServeStaticModule on the root, so /uploads/... 
      // depends on ServeStaticModule configuration. 
      // We set rootPath to join(__dirname, '..', '..', 'uploads'), 
      // mapped to serveRoot: '/uploads/' so it is available at http://localhost:4000/uploads/...
      const baseUrl = apiUrl.replace(/\/api\/v1$/, '');

      return { url: `${baseUrl}/uploads/${uniqueName}`, publicId: uniqueName };
    }
  }
}
