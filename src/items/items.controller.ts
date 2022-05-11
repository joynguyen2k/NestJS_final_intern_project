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
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import * as moment from 'moment';
@Controller('items')
@ApiTags('Items')

export class ItemsController {
    constructor(
        private itemsService: ItemsService
    ){}
    @Roles(Role.ADMIN, Role.SUPERADMIN)
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
          console.log(files);
          
 
        // return files;
        return this.itemsService.createItems(createItemsDto,files)
        
    }

    @Patch(':id')
  //   @UseInterceptors(FileInterceptor('file',{
  //     storage: diskStorage({
  //         destination: './uploads',
  //         filename: (req, file, cb) => {
  //             const filename: string = file.originalname;
  //             cb(null, `${filename}`)
  //         }
  //     })
  // }))
    @FormDataRequest()
    async updateItems(@Param('id') id: string, @Body() updateItemsDto: UpdateItemsDto, @UploadedFile() file){
        return await this.itemsService.updateItems(id, updateItemsDto, file);
    }

    @Delete('/image/:id')
    async deleteImage(@Param('id') id:string){
      return this.itemsService.deleteItemsImage(id)
    }
    @Public()
    @Get('/during')
    async updateItemDuringFlashsale(){
      const currentDate = moment().format();
      return await this.itemsService.updateItemDuringFlashsale(currentDate)
    }
    @Public()
    @Get('/after')
    async updateItemAfterFlashsale(){
      const currentDate = moment().format();
      const time = moment().subtract(5, 'minutes').format();
      return await this.itemsService.updateItemAfterFlashsale(time,currentDate)
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
    @FormDataRequest()
    async getItems(@Body() getItemsDto: GetItemDto){
      return this.itemsService.getItems(getItemsDto)
    }
    @Delete(':id')
    async deleteItems(@Param('id') id:string){
       return await this.itemsService.deleteItems(id)
    }
    @Delete('/image/:id')
    async deleteItemsImage(@Param('id') id:string){
      return await this.itemsService.deleteItemsImage(id)
    }
    @Post('/image/:id')
    @UseInterceptors(FileInterceptor('file'))
    @FormDataRequest()
    async addItemsImage(@Param('id') id:string,@UploadedFile() file: Express.Multer.File ){
      console.log(11111111);
      console.log(file);
      
        // return await this.addItemsImage(id,file.path)
    }


}


