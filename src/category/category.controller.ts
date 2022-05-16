import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FormDataRequest } from 'nestjs-form-data';
import { Roles } from 'src/auth/decorators/role.decorator';
import { editFileName, imageFileFilter } from 'src/ultils/file-uploading';
import { Role } from 'src/user/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { CategoryBanner } from './entities/category-banner.entity';
import { Category } from './entities/category.entity';

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth()

export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ){}
    @ApiConsumes('multipart/form-data')
    // @FormDataRequest()
    // @UseGuards(AuthGuard(), RolesGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Post()
    @UseInterceptors(
        FilesInterceptor('files',20,
        {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
              }), 
              fileFilter:imageFileFilter
        }
        )
      )
    async create(@Body() createCategoryDto:CreateCategoryDto, @UploadedFiles() files):Promise<Category>{
        console.log(createCategoryDto);
        console.log(files);
        
        
        return await this.categoryService.create(createCategoryDto, files)
    }
    
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
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @UseInterceptors(
        FilesInterceptor('files',20,
        {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
              }), 
              fileFilter:imageFileFilter
        }
        )
      )
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Post('/add-banner/:id')
    async addCategoryBanner(@Param('id') categoryId:string, @UploadedFiles() files ){
        console.log(files);
        
        return await this.categoryService.addCategoryBanner(categoryId, files)

    }
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete('/delete-banner/:id')
    async deleteBanner(@Param('id') id: string){
        return await this.categoryService.deleteBanner(id);
    }
    @Get(':id')
    async getCategoryById(@Param() id:string):Promise<Category>{
        return await this.categoryService.getCategoryById(id)
    }
    @ApiConsumes('multipart/form-data')
    @Get()
    async getCategory(@Body() getCategoryDto: GetCategoryDto): Promise<Category[]>{
        // console.log(getCategoryDto);
        
        return await this.categoryService.getCategory(getCategoryDto)
    }
    
    @ApiConsumes('multipart/form-data')
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Patch(':id')
    async updateCategory(@Param('id') id:string, @Body() createCategoryDto: CreateCategoryDto){
        return await this.categoryService.updateCategory(id, createCategoryDto)
    }

    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete(':id')
    async deleteCategory(@Param('id') id:string){
        return await this.categoryService.deleteCategory(id)
    }
}
