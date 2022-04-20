import { Module } from '@nestjs/common';
import { CategoryBannerService } from './category-banner.service';
import { CategoryBannerController } from './category-banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryBannerRepository } from './category-banner.repository';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';
import { CategoryRepository } from 'src/category/category.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([CategoryBannerRepository]),
    NestjsFormDataModule,
    CategoryModule,
  ],
  providers: [CategoryBannerService],
  controllers: [CategoryBannerController]
})
export class CategoryBannerModule {}
