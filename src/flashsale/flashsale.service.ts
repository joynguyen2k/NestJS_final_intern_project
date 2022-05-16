import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFlashsaleDto } from './dtos/create-flashsale.dto';
import { Flashsale } from './entities/flashsale.entity';
import { ItemFlashsale } from './entities/item-flashsale.entity';
import * as moment from 'moment';
import { ItemFlashsaleDto } from './dtos/create-item-flashsale.dto';
import { GetFlashsaleDto } from './dtos/get-flashsale.dto';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class FlashsaleService {
    constructor(
        @InjectRepository(Flashsale)
        private FlashsaleRepository: Repository<Flashsale>,
        @InjectRepository(ItemFlashsale)
        private ItemFlashsaleRepository: Repository<ItemFlashsale>,
        private itemsService: ItemsService
    ){}
    async createFlashsale(createFlashsaleDto: CreateFlashsaleDto){
        const{name, description, startSale, endSale, itemFlashsale}= createFlashsaleDto;
        const currentDate= moment().format()
        console.log('1',createFlashsaleDto);
        
        const flashsale= await this.FlashsaleRepository.create({
            name,
            description, 
            isSendMail:false,
            startSale, 
            endSale,
            createdAt: currentDate
        })
        await flashsale.save();
        
        for(let i=0; i< itemFlashsale.length; i++){
            // Check quantity item flashsale < quantity item
            let itemFound= await this.itemsService.getItemById(itemFlashsale[i].itemsId)
            console.log('found', itemFound);
            
            if(itemFlashsale[i].quantity > itemFound.quantity){
                throw new BadRequestException('Quantity of flashsale must be less or equal quantity of item')
            }

            const itemSale = await this.ItemFlashsaleRepository.create({
                flashsale,
                quantity: itemFlashsale[i].quantity,
                discount: itemFlashsale[i].discount,
                itemsId: itemFlashsale[i].itemsId
            })
            await this.itemsService.decreaseQuantityItems(itemFlashsale[i].itemsId, itemFlashsale[i].quantity )
            await itemSale.save();
        }
        return flashsale;
    }
    async updateItemsFlashsale(id:string, itemFlashsaleDto: ItemFlashsaleDto){
        const {quantity, discount, itemsId}= itemFlashsaleDto;
        const itemFlashsale = await this.ItemFlashsaleRepository.findOne({id});
        if(itemFlashsale){
           itemFlashsale.quantity = quantity;
           itemFlashsale.discount = discount;
           itemFlashsale.itemsId = itemsId;
           await itemFlashsale.save()
        }else{
            throw new NotFoundException('Item Flashsale Not Found!')
        }
        return itemFlashsale;
    }
    async deleteFlashale(id:string){
        const query = this.FlashsaleRepository.createQueryBuilder();
        const query2 = this.ItemFlashsaleRepository.createQueryBuilder();
        const items= this.FlashsaleRepository.findOne(id);
        if(items){
            await query2.delete()
                        .where('flashsaleId= :id',{id})
                        .execute()
            await query.delete()
                        .where('id= :id',{id})
                        .execute()
        }else{
            throw new NotFoundException(`items with ${id} not found`)
        }
        console.log(query.getSql());
        console.log(query2.getSql());
    }
    async deleteItemsFlashsale(id:string){
        const result= await this.ItemFlashsaleRepository.delete({id})
        return result;
    }
    async getFlashsale(getFlashsaleDto: GetFlashsaleDto){
        const {keyword, order, by, size, page}= getFlashsaleDto;
        const query = this.FlashsaleRepository.createQueryBuilder('flashsale')
                            .leftJoinAndSelect('flashsale.itemFlashsale','item_flashsale')
                            .orderBy('flashsale.createdAt')
                            ;
        if(keyword){
            query.andWhere(
                // 'MATCH(category.name) AGAINST(:keyword)',
                'flashsale.name ILIKE :keyword',
                { keyword: `%${keyword}%` },
            )
        }
        if(order){
            if(by==='DESC') query.orderBy(`flashsale.${order}`, 'DESC')
            else query.orderBy(`flashsale.${order}`)
            // query.andWhere(
            //     // 'MATCH(category.name) AGAINST(:keyword)',
            //     'ORDER BY :order',
            //     { order: `${order}` },
            // )
        }
        if(size){
            if(page) {query.limit(Number(size)); query.offset(Number(size*(page-1))) } 
            else {query.limit(Number(size)); query.offset(0) } 
        }else {
            if(page) {query.limit(Number(8)); query.offset(Number(8*(page-1))) } 
            else {query.limit(Number(8)); query.offset(0) } 
        }

        const result = await query.getMany();
        console.log(query.getSql());
        
        return result;
    }
    async getFlashsaleBefore1hour(){
        const currentDate = moment().format()
        const alarmDate = moment().subtract(1,'hours').format();
        console.log('alarm', alarmDate);
        
        const query = await this.FlashsaleRepository.createQueryBuilder('flashsale')
                                                    .where('flashsale.startSale <= :alarmDate and flashsale.startSale <= :currentDate ',{alarmDate, currentDate})
                                                    .getMany();
        return await query;
    }
    async updateSendMail(flashsaleId: string){
        const flashsale = await this.FlashsaleRepository.findOne({id: flashsaleId});
        flashsale.isSendMail = true;
        await flashsale.save();

    }
    async updateQuantityFlashsale(itemFlashsaleId: string, itemsId: string, quantity: number){
        const item = await this.ItemFlashsaleRepository.createQueryBuilder('itemFlashsale')
                                                        .leftJoinAndSelect('itemFlashsale.items','items')
                                                        .where(`itemFlashsale.id ='${itemFlashsaleId}'`)
                                                        .andWhere(`itemFlashsale.itemsId = '${itemsId}'`)
                                                        .getOne();
        item.quantity -= quantity;
        item.quantitySale += quantity;
        await this.ItemFlashsaleRepository.save(item);

        
    }
    async updateQuantityAfterFlashsale(id: string){
        const itemFlashsale = await this.ItemFlashsaleRepository.findOneOrFail({id});
        itemFlashsale.quantity =0;
        await this.ItemFlashsaleRepository.save(itemFlashsale)

    }

    
}
