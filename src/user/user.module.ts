import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/common/mail/mail.module';
import { editFileName, imageFileFilter } from 'src/ultils/file-uploading';
import { AddressShipping } from './entities/addressShipping.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([AddressShipping]),

    // MulterModule.register({dest:'./src/uploads',fileFilter: imageFileFilter, storage:diskStorage({filename: editFileName})})
    JwtModule.register({
      secret: 'nestjs',
      signOptions: {
        expiresIn: '30d',
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NestjsFormDataModule,
    forwardRef(()=>AuthModule),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService, PassportModule],
  exports:[UserService]
})
export class UserModule {}
