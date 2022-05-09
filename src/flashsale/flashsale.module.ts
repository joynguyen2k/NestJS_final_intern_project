import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ItemsModule } from 'src/items/items.module';
import { ItemsService } from 'src/items/items.service';
import { Flashsale } from './entities/flashsale.entity';
import { ItemFlashsale } from './entities/item-flashsale.entity';
import { FlashsaleController } from './flashsale.controller';
import { FlashsaleService } from './flashsale.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Flashsale]),
    TypeOrmModule.forFeature([ItemFlashsale]),
    NestjsFormDataModule,
    forwardRef(()=> ItemsModule)
    
  ],
  controllers: [FlashsaleController],
  providers: [FlashsaleService],
  exports:[FlashsaleService]
})
export class FlashsaleModule {}
