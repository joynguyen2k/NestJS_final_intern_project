import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports:[
    MailerModule.forRoot({
        transport: {
          host:'smtp.gmail.com',
          secure: false,
          auth: {
            user: 'joy.nguyen.bot@gmail.com',
            pass: 'danhto0712',            
          },
          
        },
    })
  ],
  providers: [MailService],
  exports:[MailService],
  controllers: [MailController]
})
export class MailModule {}
