import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Items } from 'src/items/entities/items.entity';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/user/entities/user.entity';
import { VoucherType } from 'src/voucher/enum/voucher.enum';
import { VoucherService } from 'src/voucher/voucher.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderDetail } from './entity/order-detail.entity';
import { Order } from './entity/order.entity';
import * as moment from "moment";
import { OrderStatus } from './enum/order-status.enum';
import { GetOrderDto } from './dtos/get-order.dto';
import { UpdateStatusOrderDto } from './dtos/update-status.dto';
import { FlashsaleService } from 'src/flashsale/flashsale.service';

@Injectable()
export class OrderService {
    constructor(
      @InjectRepository(Order)
      private OrderRepository: Repository<Order>,
      @InjectRepository(OrderDetail)
      private OrderDetailRepository: Repository<OrderDetail>,
      private voucherService: VoucherService,
      private itemsService: ItemsService,
      private flashsaleService: FlashsaleService
    ){}
    async createOrder(createOrderDto: CreateOrderDto, user: User){
      const {code, address, itemOrder}= createOrderDto;
      console.log('item', itemOrder);
      
      const currentDate = moment().format();
      
      let sumWeight = 0;
      let totalPrice = 0;
      let shippingPrice=0 ;



      let discountPrice =0;
      let itemList=[];


      // Insert into order detail
      console.log(itemOrder);
      
      for(let i =0; i< itemOrder.length; i++){
        // let item= await this.itemsService.getItemByFlashsale(itemOrder[i].itemsId);
        // // If item of flashsale exist and quantity >0
        // if(item && item.itemFlashsale[0].quantity > 0   ){
        //   console.log('abc');
          
        //   item.itemFlashsale[0].quantity -= itemOrder[i].quantity;
        //   // item.itemFlashsale[0].save();
        // }else{
        //   console.log('xyz');
          
        //   item = await this.itemsService.getItemById(itemOrder[i].itemsId);
        //   item.priceNew = item.price;
        // }
        // // If item flashsale not exist
        // if(!item){
        //   item = await this.itemsService.getItemById(itemOrder[i].itemsId)

        // }
        let item = await this.itemsService.getItemOrder(itemOrder[i].itemsId);
        if(item &&item.itemFlashsale && item.itemFlashsale[0].quantity >=  itemOrder[i].quantity){
          console.log(78909123);
          console.log('fs',item.itemFlashsale[0].id);
          await this.flashsaleService.decreaseQuantityFlashsale(item.itemFlashsale[0].id, item.id, itemOrder[i].quantity )
        }else if(item && item.quantity >=  itemOrder[i].quantity){
          console.log(99999999);
          await this.itemsService.decreaseQuantityItems(itemOrder[i].itemsId,itemOrder[i].quantity )
        }else{
          throw new BadRequestException('Quantity is not enough to order')
        }
        // calculation
        sumWeight += item.weight * itemOrder[i].quantity;
        totalPrice += item.priceNew * itemOrder[i].quantity;
        item.quantity = itemOrder[i].quantity;
        // decrease quantity
        itemList.push(item);        
      }

      console.log('item', itemList);
      
      // Shipping Price
      if(sumWeight < 1) shippingPrice = 20000
      else if(sumWeight >= 1 && sumWeight < 3) shippingPrice = 30000
      else shippingPrice = sumWeight * 5000;

      let totalPriceVoucher: number = totalPrice;
      let shippingPriceVoucher :number = shippingPrice;
      // Get voucher
      let voucherOrder= await this.voucherService.getVoucherByCode(code);
      if(code){
        // Use voucher
        if(!voucherOrder) throw new NotFoundException(`Wrong code. Please check again`);
        if(voucherOrder.quantity <=0) throw new BadRequestException(`Code ${code} out of quantity`);
        // Discount total money
        if(voucherOrder.discount > 100){
          // voucher discount 
            
          if(voucherOrder.type === VoucherType.DISCOUNT) {
              
            // Bill has value min
               let min = voucherOrder.min === null? 0: voucherOrder.min;
                if(totalPrice >= min ){
                    discountPrice =  voucherOrder.discount ;

                  
                  
                  totalPriceVoucher = totalPrice -  discountPrice;
                  totalPriceVoucher < 0? 0: totalPriceVoucher;
                  await this.voucherService.decreaseVoucher(code)
                  
                }
                          
              } ;
          // voucher freeship
            if(voucherOrder.type === VoucherType.FREESHIP){
              console.log('fs');
              
              let min = voucherOrder.min === null? 0: voucherOrder.min;
              if(totalPrice >= min ){
                  discountPrice =  voucherOrder.discount
                  shippingPriceVoucher = shippingPrice - discountPrice;
                  shippingPriceVoucher <0 ? 0:shippingPriceVoucher;
                  await this.voucherService.decreaseVoucher(code)
  
              }
            }
      }else{
            if(voucherOrder.type === VoucherType.DISCOUNT) {
      
              // Bill has value min
    
                  let min = voucherOrder.min === null? 0: voucherOrder.min;
                  if(totalPrice >= min ){
                    if(voucherOrder.max === null){
                      discountPrice = (totalPrice * (voucherOrder.discount) /100) ;
                    }else{
                      discountPrice = (totalPrice * (voucherOrder.discount) /100) >= voucherOrder.max ? voucherOrder.max : (totalPrice * (voucherOrder.discount) /100) 
                    }
                    
                    totalPriceVoucher = totalPrice - discountPrice;
                    totalPriceVoucher < 0? 0: totalPriceVoucher;
                  await this.voucherService.decreaseVoucher(code)
  
                    
                  }
                            
                } ;
            // voucher freeship
            if(voucherOrder.type === VoucherType.FREESHIP){
                let min = voucherOrder.min === null? 0: voucherOrder.min;
                if(totalPrice >= min ){
                  if(voucherOrder.max === null){
                    discountPrice =  (shippingPrice*(voucherOrder.discount) /100) ;
                  }else{
                    discountPrice =  (shippingPrice*(voucherOrder.discount) /100) >= voucherOrder.max ? voucherOrder.max : (shippingPrice*(voucherOrder.discount) /100)
                  }
                  shippingPriceVoucher  = shippingPrice - discountPrice;
                  shippingPriceVoucher <0 ? 0:shippingPriceVoucher ;
                  await this.voucherService.decreaseVoucher(code)
  
      
                }
              }
      }  
        console.log('total', totalPrice);
        const order = await this.OrderRepository.create({
          voucher: voucherOrder,
          addressShippingId: address,
          status: OrderStatus.WAITING,
          user,
          shippingPrice: shippingPriceVoucher ,
          itemsPrice: totalPrice,
          total: shippingPrice + totalPriceVoucher,
          createdAt: currentDate
        })
        await order.save()
        
        for(let i =0; i < itemList.length; i++){
                  
          const orderDetail = await this.OrderDetailRepository.create({
            quantity: itemList[i].quantity,
            price: itemList[i].priceNew,
            items: itemList[i],

  
            createdAt: currentDate,
            order: order
          })
          await orderDetail.save()
        }
        return await order;
  
      // Create order
  
      }
      const order = await this.OrderRepository.create({
        
        addressShippingId: address,
        status: OrderStatus.WAITING,
        user,
        shippingPrice: shippingPrice,
        itemsPrice: totalPrice,
        total: shippingPrice + totalPrice,
        createdAt: currentDate
      })
      await order.save()
      
      for(let i =0; i < itemList.length; i++){
                
        const orderDetail = await this.OrderDetailRepository.create({
          quantity: itemList[i].quantity,
          price: itemList[i].priceNew,
          items: itemList[i],
          itemFlashsale: itemList[i].itemFlashsale[i],
          createdAt: currentDate,
          order: order
        })
        await orderDetail.save()
      }
      return await order;

      
      
    
    
    
    
  }
    async getOrderByUser( getOrderDto: GetOrderDto, user: User){
      const { order, by, size, page, status}= getOrderDto;
      const query = await this.OrderRepository.createQueryBuilder('order')
                                              .leftJoinAndSelect('order.orderDetail','order_detail')
                                              .leftJoinAndSelect('order.addressShipping','address_shipping')
                                              .leftJoinAndSelect('order_detail.items','items')
                                              .leftJoinAndSelect('order_detail.itemFlashsale','item_flashsale')
                                              .innerJoinAndSelect('order.user', 'user')
                                              .where('order.userId = :userId',{userId:user.id})
                                              .andWhere('order.status = :status',{status})
      if(order){
          if(by==='DESC') query.orderBy(`order.${order}`, 'DESC')
          else query.orderBy(`order.${order}`)
      }
      if(size){
          if(page) {query.limit(Number(size)); query.offset(Number(size*(page-1))) } 
          else {query.limit(Number(size)); query.offset(0) } 
      }else {
          if(page) {query.limit(Number(8)); query.offset(Number(8*(page-1))) } 
          else {query.limit(Number(8)); query.offset(0) } 
      }

      const myOrder = query.getMany();
      return myOrder;
    }
    // For admin and super admin
    async getAllOrder(getOrderDto: GetOrderDto, user: User){
      const { order, by, size, page}= getOrderDto;
      const query = await this.OrderRepository.createQueryBuilder('order')
                                              .leftJoinAndSelect('order.orderDetail','order_detail')
                                              .leftJoinAndSelect('order.addressShipping','address_shipping')
                                              .leftJoinAndSelect('order_detail.items','items')
                                              .leftJoinAndSelect('order_detail.itemFlashsale','item_flashsale')
      if(order){
          if(by==='DESC') query.orderBy(`order.${order}`, 'DESC')
          else query.orderBy(`order.${order}`)
      }
      if(size){
          if(page) {query.limit(Number(size)); query.offset(Number(size*(page-1))) } 
          else {query.limit(Number(size)); query.offset(0) } 
      }else {
          if(page) {query.limit(Number(8)); query.offset(Number(8*(page-1))) } 
          else {query.limit(Number(8)); query.offset(0) } 
      }

      const allOrder = query.getMany();
      return allOrder;
    }
    async updateStatusOrder(id: string,updateStatusOrderDto: UpdateStatusOrderDto){
      console.log('11111111', id);
      
      const {status}= updateStatusOrderDto;
      const order = await this.OrderRepository.findOneOrFail(id)
      console.log('order',order);
      order.status = status;
      return this.OrderRepository.save(order)
      
    }
    async deleteOrder(id:string){
      const query = await this.OrderRepository.createQueryBuilder();
      const query2 = await this.OrderDetailRepository.createQueryBuilder();
      const order = await this.OrderRepository.findOne({id});
      if(order){
        await query2.delete()
                    .where('orderId= :id',{id})
                    .execute()
        await query.delete()
                    .where('id= :id',{id})
                    .execute()
      }else{
        throw new NotFoundException(`Order ${id} not found`)
      }
    }
}
