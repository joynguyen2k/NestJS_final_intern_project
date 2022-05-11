import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { ConfigModule } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Category } from './entities/category.entity';
import { CategoryBanner } from './entities/category-banner.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([CategoryBanner]),
    NestjsFormDataModule
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports:[CategoryService]
})
export class CategoryModule {}
