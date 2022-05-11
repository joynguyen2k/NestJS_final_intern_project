import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { VoucherModule } from 'src/voucher/voucher.module';
import { AddressShipping } from '../user/entities/addressShipping.entity';
import { OrderDetail } from './entity/order-detail.entity';
import { Order } from './entity/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PassportModule } from '@nestjs/passport';
import { ItemsModule } from 'src/items/items.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FlashsaleModule } from 'src/flashsale/flashsale.module';


@Module({
  imports:[
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([OrderDetail]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UserModule,
    VoucherModule,
    ItemsModule,
    FlashsaleModule,
    NestjsFormDataModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
