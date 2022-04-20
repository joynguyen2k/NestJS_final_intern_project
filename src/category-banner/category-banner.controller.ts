import { Body, Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import path, { join } from 'path';
import { diskStorage } from 'multer';
import { extname } from  'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { CategoryService } from 'src/category/category.service';
import { CreateCategoryBannerDto } from './dtos/create-category-banner.dto';
import { CategoryBannerService } from './category-banner.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { off } from 'process';

export const storage = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') ;
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}

@Controller('category-banner')
// @ApiBearerAuth()
@ApiTags('CategoryBanner')
export class CategoryBannerController {
    constructor(
        private categoryBannerService: CategoryBannerService
    ){}
    // @Post()
   
    
    // createBanner(@Body() createCategoryBannerDto: CreateCategoryBannerDto, @UploadedFile() file){
    //     console.log(createCategoryBannerDto);
        
    //     return this.categoryBannerService.createBanner(createCategoryBannerDto);
    // }
    @Post('upload')
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const filename: string = file.originalname;
                cb(null, `${filename}`)
            }
        })
    }))
    uploadFile(@Body() createCategoryBannerDto: CreateCategoryBannerDto, @UploadedFile() file, @Req() req){
        console.log(file);
        
        return of (this.categoryBannerService.createBanner({...createCategoryBannerDto,url: file.path}))
    }

    @Get('image/:imagename')
    findImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/' + imagename)));
    }
    @Delete(':id')
    async deleteBanner(@Param() id: string){        
        return await this.categoryBannerService.deleteBanner(id);
    }
}
