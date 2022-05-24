import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/user/role.enum';
import { CreateFlashsaleDto } from './dtos/create-flashsale.dto';
import { ItemFlashsaleDto } from './dtos/create-item-flashsale.dto';
import { GetFlashsaleDto } from './dtos/get-flashsale.dto';
import { FlashsaleService } from './flashsale.service';

@Controller('flashsale')
@ApiTags('Flash sale')
@ApiBearerAuth()
export class FlashsaleController {
    constructor(
        private flashsaleService: FlashsaleService 
    ){}
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @ApiConsumes('multipart/form-data')
    @Post()
    async createFlashsale(@Body() createFlashsaleDto: CreateFlashsaleDto){
        // console.log(createFlashsaleDto);
        // const{itemFlashsale}= createFlashsaleDto
        // console.log('11111111',itemFlashsale);
        return this.flashsaleService.createFlashsale(createFlashsaleDto);
        
    }

    @Get()
    @ApiConsumes('multipart/form-data')
    async getFlashsale(@Param() getFlashsaleDto: GetFlashsaleDto){
        return await this.flashsaleService.getFlashsale(getFlashsaleDto)
    }

    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Patch('/items/:id')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest()
    async updateItemsFlashsale(@Param('id') id:string, @Body() itemFlashsaleDto: ItemFlashsaleDto){
        console.log(id);
        
        console.log(itemFlashsaleDto);
        
        return await this.flashsaleService.updateItemsFlashsale(id, itemFlashsaleDto)
    }

    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete('/items/:id')
    async deleteItemsFlashsale(@Param('id') id: string){
        return await this.flashsaleService.deleteItemsFlashsale(id)
    }

    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete(':id')
    async deleteFlashsale(@Param('id') id:string){
        return await this.flashsaleService.deleteFlashale(id)
    }

    
}
