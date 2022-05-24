import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { GetVoucherDto } from './dtos/get-voucher.dto';
import { Voucher } from './entity/voucher.entity';
import { VoucherType } from './enum/voucher.enum';
import { voucherPagination } from './voucher.constants';

@Injectable()
export class VoucherService {
    constructor(
        @InjectRepository(Voucher)
        private VoucherRepository: Repository<Voucher>
    ){}
    async createVoucher(createVoucherDto: CreateVoucherDto){
        console.log(createVoucherDto);
        
        const voucher = await this.VoucherRepository.save({
            ...createVoucherDto
        })
        return await voucher;

    }
    async getVoucherById(id: string){
        return await this.VoucherRepository.findOne({id})
    }
    async getVoucherByCode(code: string){            
        const currentDate = moment().format();
        const voucher = await this.VoucherRepository.createQueryBuilder('voucher')
                                                    .where(`voucher.code = '${code}'`)
                                                    .andWhere(`voucher.startVoucher <= '${currentDate}'`)
                                                    .andWhere(`voucher.endVoucher >= '${currentDate}'`)
                                                    .andWhere(`voucher.quantity > 0`)
                                                    .getOne();        
        if(!voucher){
          throw new NotFoundException(`Voucher with ${code} not exist`)
        }
        
        return voucher;
    }
    async getVoucher(getVoucherDto: GetVoucherDto){
        const {keyword, order, by, size, page}= getVoucherDto;
        let pageNumber =  page === undefined ? voucherPagination.PAGE : Number(page)  ;
        let sizePage = size === undefined ? voucherPagination.PAGE_SIZE: Number(size)  ;                
        let off = Number(size*(page-1))        
        const query = this.VoucherRepository.createQueryBuilder('voucher')
                                            .limit(Number(sizePage))
                                            .offset(Number(sizePage*(pageNumber-1)))

                                            
        if(keyword){
            query.andWhere(
                'voucher.code ILIKE :keyword',
                { keyword: `%${keyword}%` },
            )
        }
        if(order){
            if(by==='DESC') query.orderBy(`voucher.${order}`, 'DESC')
            else query.orderBy(`voucher.${order}`)
        }
        const voucher = await query.getMany();
        const count = await query.getCount();        
        return {voucher, page: pageNumber , totalPages: Math.ceil(count /sizePage) };
    }
    async updateVoucher(id: string, createVoucherDto: CreateVoucherDto){
        const {code, type, description, discount, min, max, quantity, startVoucher, endVoucher}= createVoucherDto;
        const voucher = await this.getVoucherById(id);
        if(voucher){
            voucher.code = code;
            voucher.type = type;
            voucher.description = description;
            voucher.discount = discount;
            voucher.quantity = quantity;
            voucher.min = min;
            voucher.max = max;
            voucher.startVoucher = startVoucher;
            voucher.endVoucher = endVoucher;
            return await this.VoucherRepository.save(voucher)
        }else{
            throw new NotFoundException(`Voucher with ${id} not found`)
        }
    }
    async deleteVoucher(id: string){
        const voucher = this.getVoucherById(id);
        if(voucher){
            const result= await this.VoucherRepository.delete({id});
            if(result.affected ===1){
                return result;
                
            }
          
        }else{
            throw new NotFoundException(`Voucher with ${id} not found`)
        }
    }
    async decreaseVoucher(code: string){
        const voucher = await this.getVoucherByCode(code);
        voucher.quantity -= 1;
        return await this.VoucherRepository.save(voucher)
    }
    async calculatingVoucher(code: string, totalPrice: number, shippingPrice: number){
        const voucherOrder= await this.getVoucherByCode(code);
        const currentDate = moment().format();
        let totalPriceVoucher;
        let shippingPriceVoucher
        let discountPrice;
            // Use voucher
            if(!voucherOrder) throw new NotFoundException(`Wrong code or voucher's quantity not enough. Please check again`);
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
                      await this.decreaseVoucher(code)
                      
                    }
                              
                  } ;
              // voucher freeship
                if(voucherOrder.type === VoucherType.FREESHIP){
                  
                  let min = voucherOrder.min === null? 0: voucherOrder.min;
                  if(totalPrice >= min ){
                      discountPrice =  voucherOrder.discount
                      shippingPriceVoucher = shippingPrice - discountPrice;
                      shippingPriceVoucher <0 ? 0:shippingPriceVoucher;
                      await this.decreaseVoucher(code)
      
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
                      await this.decreaseVoucher(code)
      
                        
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
                      await this.decreaseVoucher(code)
      
          
                    }
                  }
          }  

    }
}
