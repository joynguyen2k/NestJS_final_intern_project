import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryBannerRepository } from './category-banner.repository';
import { CreateCategoryBannerDto } from './dtos/create-category-banner.dto';
import { CategoryBanner } from './entities/category-banner.entity';

@Injectable()
export class CategoryBannerService {
    constructor(
        @InjectRepository(CategoryBannerRepository)
        private categoryBannerRepository: CategoryBannerRepository
    ){}
    async createBanner(createCategoryBannerDto: CreateCategoryBannerDto):Promise<CategoryBanner>{
        return this.categoryBannerRepository.createBanner(createCategoryBannerDto);
    }
    async deleteBanner(id: string){
        return this.categoryBannerRepository.deleteBanner(id)
    }
}
