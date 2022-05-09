import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateFlashsaleDto } from './dtos/create-flashsale.dto';
import { ItemFlashsaleDto } from './dtos/create-item-flashsale.dto';
import { GetFlashsaleDto } from './dtos/get-flashsale.dto';
import { FlashsaleService } from './flashsale.service';

@Controller('flashsale')
@ApiTags('Flash sale')

export class FlashsaleController {
    constructor(
        private flashsaleService: FlashsaleService 
    ){}
    @Post()
    async createFlashsale(@Body() createFlashsaleDto: CreateFlashsaleDto){
        // console.log(createFlashsaleDto);
        // const{itemFlashsale}= createFlashsaleDto
        // console.log('11111111',itemFlashsale);
        return this.flashsaleService.createFlashsale(createFlashsaleDto);
        
    }
    @Get()
    async getFlashsale(@Body() getFlashsaleDto: GetFlashsaleDto){
        return await this.flashsaleService.getFlashsale(getFlashsaleDto)
    }
    @Patch('/items/:id')
    @FormDataRequest()
    async updateItemsFlashsale(@Param('id') id:string, @Body() itemFlashsaleDto: ItemFlashsaleDto){
        console.log(id);
        
        console.log(itemFlashsaleDto);
        
        return await this.flashsaleService.updateItemsFlashsale(id, itemFlashsaleDto)
    }
    @Delete('/items/:id')
    async deleteItemsFlashsale(@Param('id') id: string){
        return await this.flashsaleService.deleteItemsFlashsale(id)
    }
    @Delete(':id')
    async deleteFlashsale(@Param('id') id:string){
        return await this.flashsaleService.deleteFlashale(id)
    }
    @Get('/flashsale_1hour')
    async getFlashsaleBefore1hour(){
        return await this.flashsaleService.getFlashsaleBefore1hour();
    }
    
}
