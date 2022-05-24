import { Module } from '@nestjs/common';
import { FsService } from '../fs/fs.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports:[
    FsService
  ],
  providers: [CloudinaryProvider, CloudinaryService, FsService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}