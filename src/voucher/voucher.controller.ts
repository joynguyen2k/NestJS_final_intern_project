import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/user/role.enum';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { GetVoucherDto } from './dtos/get-voucher.dto';
import { VoucherService } from './voucher.service';

@Controller('voucher')
@ApiTags('Voucher')
@ApiBearerAuth()

export class VoucherController {
    constructor(
        private voucherService: VoucherService
    ){}
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Post()
    @ApiBody({type:[CreateVoucherDto]})
    @FormDataRequest()
    async createVoucher(@Body() createVoucherDto: CreateVoucherDto){
        console.log(createVoucherDto);
        
        return await this.voucherService.createVoucher(createVoucherDto);
    }
    @Public()
    @Get('/code')
    async getVoucherByCode(@Body() code:string){
        console.log(code);
        
        return await this.voucherService.getVoucherByCode(code)
    }
    @Public()
    @Get()
    async getVoucher(@Param() getVoucherDto: GetVoucherDto){
        return await this.voucherService.getVoucher(getVoucherDto);
    }
    @Public()
    @Get(':id')
    async getVoucherById(@Param('id') id:string){
        return await this.voucherService.getVoucherById(id)
    }

    @Roles(Role.ADMIN, Role.SUPERADMIN)
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
