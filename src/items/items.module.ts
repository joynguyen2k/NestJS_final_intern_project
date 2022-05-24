import { forwardRef, Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { ItemsImage } from './entities/items-image.entity';
import { Items } from './entities/items.entity';
import { MulterModule } from '@nestjs/platform-express';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { editFileName, imageFileFilter } from 'src/ultils/file-uploading';
import { diskStorage } from 'multer';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/role.guard';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { FlashsaleModule } from 'src/flashsale/flashsale.module';
import { FlashsaleService } from 'src/flashsale/flashsale.service';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Items]),
    TypeOrmModule.forFeature([ItemsImage]),
    CategoryModule,
    NestjsFormDataModule,
    AuthModule,
    PassportModule.register({defaultStrategy:'jwt'}),
    CloudinaryModule,
    MulterModule.register({
      dest: './uploads/',
      fileFilter: imageFileFilter,
    }),  

  ],
  providers: [
    ItemsService,
    // FlashsaleService,

    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  controllers: [ItemsController],
  exports:[ItemsService]
})
export class ItemsModule {}
