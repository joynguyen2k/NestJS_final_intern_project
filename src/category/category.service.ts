import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryRepository)
        private categoryRepository: CategoryRepository
    ){}
    create(createCategoryDto: CreateCategoryDto){
        return this.categoryRepository.createCategory(createCategoryDto)
    }
    async getCategoryById(id: string): Promise<Category>{
        return this.categoryRepository.findOne({where:id})
    }
    async getCategory(getCategoryDto: GetCategoryDto):Promise<Category[]>{
        return await this.categoryRepository.getCategory(getCategoryDto)
    }
    async updateCategory(id: string, createCategoryDto: CreateCategoryDto){
        return await this.categoryRepository.updateCategory(id, createCategoryDto)
    }
    async deleteCategory(id:string){
        return await this.categoryRepository.deleteCategory(id)
    }
}
