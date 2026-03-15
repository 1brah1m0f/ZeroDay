import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  async processUploadedFiles(files: Express.Multer.File[]) {
    // Generate secure URLs accessible from the frontend public static folder
    const urls = files.map((file) => {
        // Assume API runs behind a proxy/domain, or on localhost.
        // For production, this should be an env variable like process.env.PUBLIC_URL
        const baseUrl = process.env.API_URL || 'http://localhost:4000';
        return `${baseUrl}/uploads/${file.filename}`;
    });

    return {
      message: 'Şəkillər uğurla yükləndi!',
      urls,
      count: files.length,
    };
  }
}
