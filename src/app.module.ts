import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { CategoryBannerModule } from './category-banner/category-banner.module';
import { ItemsModule } from './items/items.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FlashsaleModule } from './flashsale/flashsale.module';
import { VoucherModule } from './voucher/voucher.module';
import { OrderModule } from './order/order.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CronModule } from './common/cron/cron.module';

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
    CategoryBannerModule,
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
    CronModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
