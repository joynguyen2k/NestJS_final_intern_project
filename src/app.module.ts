import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { ItemsModule } from './items/items.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FlashsaleModule } from './flashsale/flashsale.module';
import { VoucherModule } from './voucher/voucher.module';
import { OrderModule } from './order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CronModule } from './common/cron/cron.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt.guard';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { imageFileFilter } from './ultils/file-uploading';

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
      // logging: true,
    }),
    CategoryModule,
    ItemsModule,
    UserModule,
    AuthModule,
    FlashsaleModule,
    VoucherModule,
    OrderModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CronModule,
    CloudinaryModule,
    MulterModule.register({
      dest: './uploads/',
      fileFilter: imageFileFilter,
    }),  
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, 
  ],
})
export class AppModule {}
