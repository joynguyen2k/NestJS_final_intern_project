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

@Injectable()
export class OrderService {
    constructor(
      @InjectRepository(Order)
      private OrderRepository: Repository<Order>,
      @InjectRepository(OrderDetail)
      private OrderDetailRepository: Repository<OrderDetail>,
      private voucherService: VoucherService,
      private itemsService: ItemsService
    ){}
    async createOrder(createOrderDto: CreateOrderDto, user: User){
      const {code, address, itemOrder}= createOrderDto;
      const currentDate = moment().format();
      
      let sumWeight = 0;
      let totalPrice = 0;
      let shippingPrice = 0;
      let discountPrice = 0;
      let itemList=[];


      // Insert into order detail
      
      for(let i =0; i< itemOrder.length; i++){
        let item= await this.itemsService.getItemsByFlashsale(itemOrder[i].itemsId)
        // console.log('itemId', itemOrder[i].itemsId);
        // console.log(item);
        
        // If item of flashsale exist and quantity >0
        if(item && item.itemFlashsale[0].quantity > 0   ){
          item.price -=  (item.price * item.itemFlashsale[0].discount)/100;
          
          item.itemFlashsale[0].quantity -= 1;
          item.itemFlashsale[0].save();

        }
        // If item flashsale not exist
        if(!item){
          item = await this.itemsService.getItemById(itemOrder[i].itemsId)
        }
        // calculation
        sumWeight += item.weight * itemOrder[i].quantity;
        totalPrice += item.price * itemOrder[i].quantity;
        item.quantity = itemOrder[i].quantity;
        // decrease quantity
        let newItem= await this.itemsService.decreaseQuantityItems(itemOrder[i].itemsId,itemOrder[i].quantity )
        itemList.push(item);
        
      }
      console.log('totalPrice', totalPrice);
      
      // Shipping Price
      if(sumWeight < 1) shippingPrice = 20000
      else if(sumWeight >= 1 && sumWeight < 3) shippingPrice = 30000
      else shippingPrice = sumWeight * 5000
      
      // Get voucher
      if(code){
        const voucherOrder= await this.voucherService.getVoucherByCode(code);
        // Use voucher
        if(!voucherOrder) throw new NotFoundException(`Wrong code. Please check again`);
        if(voucherOrder.quantity <=0) throw new BadRequestException(`Code ${code} out of quantity`);
        // Discount total money
        if(voucherOrder.discount > 100){
        // voucher discount 
          console.log('discount money');
          
          if(voucherOrder.type === VoucherType.DISCOUNT) {
            
          // Bill has value min

              let min = voucherOrder.min === null? 0: voucherOrder.min;
              if(totalPrice >= min ){
                if(voucherOrder.max === null){
                  discountPrice =  voucherOrder.discount ;
                }else{
                  discountPrice =  voucherOrder.discount >= voucherOrder.max ? voucherOrder.max :  voucherOrder.discount; 
                }
                console.log('discount',discountPrice );
                
                
                totalPrice -= discountPrice;
                totalPrice < 0? 0: totalPrice;
                await this.voucherService.decreaseVoucher(code)
                
              }
                        
            } ;
        // voucher freeship
          if(voucherOrder.type === VoucherType.FREESHIP){
            console.log('fs');
            
            let min = voucherOrder.min === null? 0: voucherOrder.min;
            if(totalPrice >= min ){
              if(voucherOrder.max === null){
                discountPrice = (totalPrice - voucherOrder.discount) ;
              }else{
                discountPrice = (totalPrice - voucherOrder.discount) >= voucherOrder.max ? voucherOrder.max : (totalPrice * voucherOrder.discount)/100 
              }
              shippingPrice -= discountPrice;
              shippingPrice<0 ? 0:shippingPrice;
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
                  
                  totalPrice -= discountPrice;
                  totalPrice < 0? 0: totalPrice;
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
                shippingPrice -= discountPrice;
                shippingPrice<0 ? 0:shippingPrice;
                await this.voucherService.decreaseVoucher(code)

    
              }
            }
        }

      
      
      // Create order
  
      
      
      const order = await this.OrderRepository.create({
        
        voucher: voucherOrder,
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
          price: itemList[i].price,
          items: itemList[i],
          createdAt: currentDate,
          order: order
        })
        await orderDetail.save()
      }
      return await order;
      }
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
