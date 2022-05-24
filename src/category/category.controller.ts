import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FormDataRequest } from 'nestjs-form-data';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { editFileName, imageFileFilter } from 'src/ultils/file-uploading';
import { Role } from 'src/user/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { UpdateCategoryDto } from './dto/update-category-dto';
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
    @UseInterceptors(FilesInterceptor('files',20))
    async create(@Body() createCategoryDto:CreateCategoryDto, @UploadedFiles() files){
        
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
    @UseInterceptors(FilesInterceptor('files',20))
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

    @Public()
    @Get(':id')
    async getCategoryById(@Param('id') id:string){
        return await this.categoryService.getCategoryById(id)
    }
    @ApiConsumes('multipart/form-data')
    @Public()
    @Get()
    async getCategory(@Query() getCategoryDto: GetCategoryDto){
        // console.log(getCategoryDto);
        
        return await this.categoryService.getCategory(getCategoryDto)
    }
    
    @ApiConsumes('multipart/form-data')
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Patch(':id')
    async updateCategory(@Param('id') id:string, @Body() updateCategoryDto: UpdateCategoryDto){
        return await this.categoryService.updateCategory(id, updateCategoryDto)
    }

    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete(':id')
    async deleteCategory(@Param('id') id:string){
        return await this.categoryService.deleteCategory(id)
    }
}
