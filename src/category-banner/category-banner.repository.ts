import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryRepository } from "src/category/category.repository";
import { CategoryService } from "src/category/category.service";
import { Category } from "src/category/entities/category.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateCategoryBannerDto } from "./dtos/create-category-banner.dto";
import { CategoryBanner } from "./entities/category-banner.entity";

@EntityRepository(CategoryBanner)
export class CategoryBannerRepository extends Repository<CategoryBanner>{
    async createBanner(createCategoryBannerDto: CreateCategoryBannerDto){
        const {position, url, categoryId}= createCategoryBannerDto;
        const categoryBn= await this.create({
           position,
           url,
           categoryId
          });
      
        await this.save(categoryBn);
        return categoryBn;
    }
    async deleteBanner(id:string){
        const result=await this.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}