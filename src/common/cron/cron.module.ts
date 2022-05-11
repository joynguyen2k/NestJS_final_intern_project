import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { FlashsaleModule } from 'src/flashsale/flashsale.module';
import { ItemsModule } from 'src/items/items.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from '../mail/mail.module';
import { CronService } from './cron.service';

@Module({
    imports:[
        FlashsaleModule,
        MailModule,
        UserModule,
        ItemsModule
        
    ],
    providers:[CronService]
})
export class CronModule {}
