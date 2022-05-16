import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { FlashsaleService } from 'src/flashsale/flashsale.service';
import { Repository } from 'typeorm';
import { CreateItemsDto } from './dtos/create-items.dto';
import { GetItemDto } from './dtos/get-items.dto';
import { UpdateItemsDto } from './dtos/update-items.dto';
import { ItemsImage } from './entities/items-image.entity';
import { Items } from './entities/items.entity';
import { ItemsStatus } from './items-status.enum';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Items)
        private ItemsRepository: Repository<Items>,

        @InjectRepository(ItemsImage)
        private ItemsImageRepository: Repository<ItemsImage>,
        // private flashsaleService: FlashsaleService,
    ){}
    async getItemById(id:string){
        const items= this.ItemsRepository.createQueryBuilder('items')
                                        .leftJoinAndSelect('items.itemsImage', 'items_image')
                                        .select(['items','items_image.url'])
                                        .where(`items.id = '${id}'`)
                                        .getOne();
        return items
                            
    }
    async deleteItemsImage(id:string){
        const itemsImage = await this.ItemsImageRepository.delete(id);
        return itemsImage;
    }
    async addItemsImage(id:string, url: any){
        const itemsImage= await this.ItemsImageRepository.create({
            url,
            itemsId:id
        })
        return await itemsImage.save();

    }
    async createItems(createItemsDto: CreateItemsDto,files:any){
        const {avatar, images}= files;
        console.log(files);
        
        const {price}= createItemsDto;
        const currentDate= moment().format()
        const items = await this.ItemsRepository.save({
            ...createItemsDto,
            status: ItemsStatus.ACTIVE,
            priceNew: price,
            isSale: false,
            isDeleted: false,
            avatar: avatar[0].path,
            createdAt: currentDate

        })
        // await items.save
        // console.log(files);
        
        for(let i = 0; i< files.images.length; i++){
            console.log('abc');
            
            const createImage = await this.ItemsImageRepository.create({
                items,
                url:images[i].path
            });
            console.log('create',createImage);
            
            await createImage.save()

        }
        return items;


    }
    async updateItems(id:string, updateItemsDto: UpdateItemsDto){
        console.log(updateItemsDto);
        
        const { name,
            barcode,
            importPrice,
            price,
            weight,
            quantity,
            description,
            status}= updateItemsDto;
        const currentDate = new Date();
        const item= await this.getItemById(id);
        
            item.name= name;
            item.barcode= barcode;
            item.importPrice= importPrice;
            item.price = price;
            item.weight = weight;
            item.quantity= quantity;
            item.description= description;
            item.updatedAt= currentDate;
            item.status = status;

           
        

            
        
        return await this.ItemsRepository.save(item);
    }
    async getItems(getItemsDto: GetItemDto){
        const {keyword, order, by, size, page}= getItemsDto;
        const query = this.ItemsRepository.createQueryBuilder('items')
                                            .leftJoinAndSelect('items.itemsImage','items_image')
        if(keyword){
            query.andWhere(
                // 'MATCH(category.name) AGAINST(:keyword)',
                'items.name LIKE :keyword',
                { keyword: `%${keyword}%` },
            )
        }
        if(order){
            if(by==='DESC') query.orderBy(`items.${order}`, 'DESC')
            else query.orderBy(`items.${order}`)
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
    async deleteItems(id:string){
        const currentDate = new Date();
        const item = await this.ItemsRepository.findOne({id});
        const itemsOrder= await this.ItemsRepository.createQueryBuilder('items')
                                        .innerJoin('items.orderDetail','order-detail')
                                        .innerJoin('order-detail.order', 'order')
                                        .where(`order.status IN ('WAITING','DELIVERING')`)
                                        .andWhere(`items.id = '${id}'`)
                                        .getOne();
        console.log(itemsOrder);
        
        if(!item){
            throw new NotFoundException(`Item with ID ${id} not found`);
        }
        if(itemsOrder){
            throw new BadRequestException('Cannot delete this items');
        }
        item.isDeleted = true;
        item.deletedAt = currentDate;
        return await this.ItemsRepository.save(item);

        
    }
    async getItemByFlashsale(itemsId:string){
        console.log('cúc cu');
        
        const currentDate = moment().utcOffset('0').format()
        const query= await this.ItemsRepository.createQueryBuilder('items')
                                                .leftJoinAndSelect('items.itemFlashsale','item_flashsale')
                                                .where(`items.status = 'ACTIVE' `)
                                                .andWhere(`items.id= '${itemsId}`)
                                                .andWhere('item_flashsale.quantity > 0')
                                                .orderBy('item_flashsale.discount','DESC')
                                                // .limit(0)
                                                // .execute()
                                                .getOne()
                                                
        
                        
        return await query;
    }
    async getItemOrder(itemsId: string){
        const currentDate = moment().utcOffset('0').format()
        let item= await this.ItemsRepository.createQueryBuilder('items')
                                                .innerJoinAndSelect('items.itemFlashsale','item_flashsale')
                                                .innerJoin('item_flashsale.flashsale', 'flashsale')
                                                .where(`items.id = '${itemsId}'`)
                                                .andWhere(`items.status = 'ACTIVE' `)
                                                .andWhere('item_flashsale.quantity > 0')
                                                .andWhere('flashsale.startSale <= :currentDate ',{currentDate})
                                                .andWhere('flashsale.endSale >= :currentDate ',{currentDate})
                                                .orderBy('item_flashsale.discount','DESC')
                                                // .limit(0)
                                                .getOne();
        // item.itemFlashsale[0].quantity -= quantity;

        if(!item){
            console.log(111111111);
            
            item = await this.ItemsRepository.findOne({id:itemsId});
            if(!item){
                throw new NotFoundException(`Items ${itemsId} Not Found`);
            }
                // item.priceNew = item.price;
                // item.isSale = false;
            
        }
        // await this.ItemsRepository.save(item)
        console.log('it', item);
        
        return item;
    }
    async decreaseQuantityItems(itemsId: string, quantity: number){
        const item = await this.ItemsRepository.findOne({id: itemsId})
        item.quantity -= quantity;
        return await this.ItemsRepository.save(item);
    }

    async updateItemDuringFlashsale(currentDate: string){
        const curr = moment().format();
        const items = await this.ItemsRepository.createQueryBuilder('items')
                                                        .innerJoinAndSelect('items.itemFlashsale','item_flashsale')
                                                        .leftJoin('item_flashsale.flashsale', 'flashsale')
                                                        .where(`items.status = 'ACTIVE' `)
                                                        .andWhere(`:currentDate >=  flashsale.startSale`, {currentDate})
                                                        .andWhere(`:currentDate <=  flashsale.endSale`, {currentDate})
                                                        .andWhere('item_flashsale.quantity > 0')
                                                        .orderBy('item_flashsale.discount','DESC')
                                                        .getMany();
        
        console.log('cur', curr);
        
        
        if(items){
            for(let i =0; i< items.length; i++){
                items[i].isSale = true;
                items[i].priceNew = items[i].price - (items[i].price * (items[i].itemFlashsale[0].discount/100));
                await this.ItemsRepository.save(items)
            }

        }
        return items;
        
        
       
    }
    async updateItemAfterFlashsale(time: string, currentDate: string){
        console.log(111111111111111111);
        
        const items = await this.ItemsRepository.createQueryBuilder('items')
                                                        .innerJoinAndSelect('items.itemFlashsale','item_flashsale')
                                                        .leftJoin('item_flashsale.flashsale', 'flashsale')
                                                        .where(`:currentDate >=  flashsale.endSale`, {currentDate})
                                                        // .where(`:time <=  flashsale.endSale`, {time})
                                                        .getMany();
        
        if(items){
            for(let i =0; i< items.length; i++){
                items[i].isSale = false;
                items[i].priceNew = items[i].price;
                items[i].quantity += items[i].itemFlashsale[0].quantity;
                items[i].itemFlashsale[0].quantity = 0;
                await this.ItemsRepository.save(items);
                items[i].save();
                items[i].itemFlashsale[0].save();
                
            }

        }
        return items;
        
        
       
    }
}
