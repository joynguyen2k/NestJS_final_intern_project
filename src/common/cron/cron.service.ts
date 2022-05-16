import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { FlashsaleService } from 'src/flashsale/flashsale.service';
import { ItemsService } from 'src/items/items.service';
import {UserService} from 'src/user/user.service';
import { MailService } from '../mail/mail.service';
import * as moment from 'moment';

@Injectable()
export class CronService {
    constructor(
        private flashsaleService: FlashsaleService,
        private userService: UserService,
        private mailService: MailService,
        private schedulerRegistry: SchedulerRegistry,
        private itemsService: ItemsService
    ){}
    @Cron('52 * * * *')
    async sendMailFlashsale() {
        console.log(111111111);
        
        const flashsaleList = await this.flashsaleService.getFlashsaleBefore1hour();
        const mailList = await this.userService.getAllMail();
        if(flashsaleList.length > 0 ){
            for(let i=0; i<flashsaleList.length; i++){
                if(flashsaleList[i].isSendMail === false){
                    let url= process.env.HOST + '/';
                    const flashsale_name= flashsaleList[i].name;
                    const flashsale_description = flashsaleList[i].description
                    const startSale = flashsaleList[i].startSale.toString();
                    await this.mailService.sendEmailFlashsale(
                        url,
                        flashsale_name,
                        flashsale_description,
                        mailList,
                        startSale
                     )
                    await this.flashsaleService.updateSendMail(flashsaleList[i].id);
                }else return
                
             
            }
        }
    }
    @Cron('*/5 * * * *')
    async updateSale(){
        console.log(45678);
        
        const currentDate = moment().format();
        const time = moment().subtract(5, 'minutes').format();
        const itemsDuringFlashsale = await this.itemsService.updateItemDuringFlashsale(currentDate);
        const itemsAfterFlashsale = await this.itemsService.updateItemAfterFlashsale(time,currentDate)
        // console.log('after', itemsAfterFlashsale);

        // console.log('during', itemsDuringFlashsale);
        
        
    }
    

}