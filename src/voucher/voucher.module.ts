import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormDataRequest, NestjsFormDataModule } from 'nestjs-form-data';
import { Voucher } from './entity/voucher.entity';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Voucher]),
    NestjsFormDataModule
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService]
})
export class VoucherModule {}
