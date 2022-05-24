import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from './common/cloudinary/cloudinary.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  constructor(private cloudinary: CloudinaryService) {}

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }
}
