import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Category } from './entities/category.entity';
import { CategoryBanner } from './entities/category-banner.entity';
import { MulterModule } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/ultils/file-uploading';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([CategoryBanner]),
    NestjsFormDataModule,
    MulterModule.register({
      dest: './uploads/',
      fileFilter: imageFileFilter,
    }),  
    CloudinaryModule
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports:[CategoryService]
})
export class CategoryModule {}
