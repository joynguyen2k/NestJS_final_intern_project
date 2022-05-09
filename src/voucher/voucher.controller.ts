import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { GetVoucherDto } from './dtos/get-voucher.dto';
import { VoucherService } from './voucher.service';

@Controller('voucher')
export class VoucherController {
    constructor(
        private voucherService: VoucherService
    ){}
    @Post()
    @ApiBody({type:[CreateVoucherDto]})
    @FormDataRequest()
    async createVoucher(@Body() createVoucherDto: CreateVoucherDto){
        console.log(createVoucherDto);
        
        return await this.voucherService.createVoucher(createVoucherDto);
    }
    @Get('/code')
    async getVoucherByCode(@Body() code:string){
        console.log(code);
        
        return await this.voucherService.getVoucherByCode(code)
    }
    @Get()
    async getVoucher(@Body() getVoucherDto: GetVoucherDto){
        return await this.voucherService.getVoucher(getVoucherDto);
    }
    @Get(':id')
    async getVoucherById(@Param('id') id:string){
        return await this.voucherService.getVoucherById(id)
    }
    @Patch(':id')
    @FormDataRequest()
    async updateVoucher(@Param('id') id:string, @Body() createVoucherDto: CreateVoucherDto){
        return await this.voucherService.updateVoucher(id, createVoucherDto)
    }
    @Delete(':id')
    async deleteVoucher(@Param('id') id:string){
        return await this.voucherService.deleteVoucher(id);
    }
    
}
