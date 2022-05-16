import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateItemsDto } from './dtos/create-items.dto';
import { ItemsService } from './items.service';
import { diskStorage } from 'multer';
import { Express } from 'express'
import { editFileName, imageFileFilter, multerOptions } from 'src/ultils/file-uploading';
import { UpdateItemsDto } from './dtos/update-items.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { GetItemDto } from './dtos/get-items.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/user/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import * as moment from 'moment';
@Controller('items')
@ApiTags('Items')
@ApiBearerAuth()
export class ItemsController {
    constructor(
        private itemsService: ItemsService
    ){}
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @ApiConsumes('multipart/form-data')
    @Post()

    // @FormDataRequest()
    @UseInterceptors(
      FileFieldsInterceptor(
        [
          {name:'avatar', maxCount: 1},
          {name: 'images', maxCount: 20}

        ],
        {
          storage: diskStorage({
            destination: './uploads',
            filename: editFileName,
          }), 
          fileFilter:imageFileFilter
        }
      )
    )
    createItems(
        @Body() createItemsDto: CreateItemsDto,
        @UploadedFiles()
          files: {
            avatar: Express.Multer.File;
            images: Array<Express.Multer.File>;
          },
        ){
          console.log(createItemsDto);
          
          console.log(files);
          
 
        // return files;
        return this.itemsService.createItems(createItemsDto,files)
        
    }
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @ApiConsumes('multipart/form-data')
    @Patch(':id')
   
    @FormDataRequest()
    async updateItems(
      @Param('id') id: string, 
      @Body() updateItemsDto: UpdateItemsDto, 
    ){
        return await this.itemsService.updateItems(id, updateItemsDto);
    }
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete('/image/:id')
    async deleteImage(@Param('id') id:string){
      return this.itemsService.deleteItemsImage(id)
    }

    @Public()
    @Get(':id')
    async getItemById(@Param('id') id:string){
      return await this.itemsService.getItemById(id)
    }

    @Get('/flashsale/:id')
    async getItemsByFlashsale(@Param('id') id:string){
      // return await this.itemsService.getItemsByFlashsaleid(id)
      return await this.itemsService.getItemByFlashsale(id)
    }
    @Public()
    @Get()
    @ApiConsumes('multipart/form-data')
    @FormDataRequest()

    async getItems(@Param() getItemsDto: GetItemDto){
      return this.itemsService.getItems(getItemsDto)
    }
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete(':id')
    async deleteItems(@Param('id') id:string){
       return await this.itemsService.deleteItems(id)
    }

    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete('/image/:id')
    async deleteItemsImage(@Param('id') id:string){
      return await this.itemsService.deleteItemsImage(id)
    }

    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })
    @ApiConsumes('multipart/form-data')
    @Post('/image/:id')
    @UseInterceptors(FileInterceptor('file'))
    @FormDataRequest()
    async addItemsImage(@Param('id') id:string,@UploadedFile() file: Express.Multer.File ){
      console.log(11111111);
      console.log(file);
      
        return await this.addItemsImage(id,file)
    }


}


