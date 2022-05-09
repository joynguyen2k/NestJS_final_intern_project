import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { GetVoucherDto } from './dtos/get-voucher.dto';
import { Voucher } from './entity/voucher.entity';

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
        return await this.VoucherRepository.findOneOrFail({code})
    }
    async getVoucher(getVoucherDto: GetVoucherDto){
        const {keyword, order, by, size, page}= getVoucherDto;
        const query = this.VoucherRepository.createQueryBuilder('voucher')
        if(keyword){
            query.andWhere(
                // 'MATCH(category.name) AGAINST(:keyword)',
                'voucher.name LIKE :keyword',
                { keyword: `%${keyword}%` },
            )
        }
        if(order){
            if(by==='DESC') query.orderBy(`voucher.${order}`, 'DESC')
            else query.orderBy(`voucher.${order}`)
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
                console.log('Successfully');
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
}
