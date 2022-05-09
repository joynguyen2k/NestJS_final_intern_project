import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FlashsaleService } from 'src/flashsale/flashsale.service';
import {UserService} from 'src/user/user.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CronService {
    constructor(
        private flashsaleService: FlashsaleService,
        private userService: UserService,
        private mailService: MailService
    ){}
    @Cron('53 * * * *')
    async handleCron() {
        console.log(111111111);
        
        const flashsaleList = await this.flashsaleService.getFlashsaleBefore1hour();
        const mailList = await this.userService.getAllMail();
        if(flashsaleList.length > 0 ){
            for(let i=0; i<flashsaleList.length; i++){
                let url= process.env.HOST + '/';
                const flashsale_name= flashsaleList[i].name;
                const startSale = flashsaleList[i].startSale.toString();
                await this.mailService.sendEmailFlashsale(
                    url,
                    flashsale_name,
                    mailList,
                    startSale
                 )
            }
        }
    }
}