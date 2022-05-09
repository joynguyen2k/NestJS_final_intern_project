import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { FlashsaleModule } from 'src/flashsale/flashsale.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from '../mail/mail.module';
import { CronService } from './cron.service';

@Module({
    imports:[
        FlashsaleModule,
        MailModule,
        UserModule
        
    ],
    providers:[CronService]
})
export class CronModule {}
