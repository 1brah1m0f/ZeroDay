import { 
    Controller, 
    Post, 
    UseInterceptors, 
    UploadedFiles,
    UseGuards,
    BadRequestException,
    PayloadTooLargeException,
    UnsupportedMediaTypeException
  } from '@nestjs/common';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
  import { CurrentUser } from '../../common/decorators/current-user.decorator';
  import { MediaService } from './media.service';
  import { diskStorage } from 'multer';
  import { v4 as uuidv4 } from 'uuid';
  import { extname } from 'path';
  import * as fs from 'fs';
  
  // Ensure uploads directory exists
  const uploadDir = './uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_FILES = 5;
  const MIN_FILES = 1;
  
  @ApiTags('media')
  @Controller('media')
  export class MediaController {
    constructor(private readonly mediaService: MediaService) {}
  
    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
          },
        },
      },
    })
    @UseInterceptors(
      FilesInterceptor('files', MAX_FILES, {
        storage: diskStorage({
          destination: uploadDir,
          filename: (req, file, cb) => {
             // Generate completely random UUID for extreme security
            const uniqueName = `${uuidv4()}${extname(file.originalname).toLowerCase()}`;
            cb(null, uniqueName);
          },
        }),
        limits: {
          fileSize: MAX_FILE_SIZE,
        },
        fileFilter: (req, file, cb) => {
          if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new UnsupportedMediaTypeException('Yalnız JPEG, PNG və WEBP formatları dəstəklənir!'), false);
          }
          cb(null, true);
        },
      }),
    )
    async uploadMultipleFiles(
      @CurrentUser('id') userId: string,
      @UploadedFiles() files: Express.Multer.File[],
    ) {
      if (!files || files.length === 0) {
        throw new BadRequestException('Şəkil yüklənməyib.');
      }
      if (files.length < MIN_FILES) {
          // Remove uploaded files since they didn't meet the minimum requirement
          files.forEach(f => fs.unlinkSync(f.path));
          throw new BadRequestException(`Ən azı ${MIN_FILES} şəkil yükləməlisiniz!`);
      }
      
      return this.mediaService.processUploadedFiles(files);
    }
  }
  
