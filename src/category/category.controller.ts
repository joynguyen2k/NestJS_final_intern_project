import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FormDataRequest } from 'nestjs-form-data';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { editFileName, imageFileFilter } from 'src/ultils/file-uploading';
import { Role } from 'src/user/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { Category } from './entities/category.entity';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ){}
    @ApiConsumes('multipart/form-data')
    @FormDataRequest()
    @UseGuards(AuthGuard(), RolesGuard)
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
    async create(@Body() createCategoryDto:CreateCategoryDto):Promise<Category>{
        return await this.categoryService.create(createCategoryDto)
    }
    @Get(':id')
    async getCategoryById(@Param() id:string):Promise<Category>{
        return await this.categoryService.getCategoryById(id)
    }
    @Get()
    async getCategory(@Body() getCategoryDto: GetCategoryDto): Promise<Category[]>{
        // console.log(getCategoryDto);
        
        return await this.categoryService.getCategory(getCategoryDto)
    }

    @UseGuards(AuthGuard(), RolesGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Patch(':id')
    async updateCategory(@Param('id') id:string, @Body() createCategoryDto: CreateCategoryDto){
        return await this.categoryService.updateCategory(id, createCategoryDto)
    }

    @UseGuards(AuthGuard(), RolesGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete(':id')
    async deleteCategory(@Param('id') id:string){
        return await this.categoryService.deleteCategory(id)
    }

}
