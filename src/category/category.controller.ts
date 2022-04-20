import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ){}
    @Post()
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
    @Patch(':id')
    async updateCategory(@Param('id') id:string, @Body() createCategoryDto: CreateCategoryDto){
        return await this.categoryService.updateCategory(id, createCategoryDto)
    }
    @Delete(':id')
    async deleteCategory(@Param('id') id:string){
        return await this.categoryService.deleteCategory(id)
    }

}
