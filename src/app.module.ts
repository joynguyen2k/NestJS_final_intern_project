import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { CategoryBannerModule } from './category-banner/category-banner.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'NestJS_ecom_postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CategoryModule,
    CategoryBannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
