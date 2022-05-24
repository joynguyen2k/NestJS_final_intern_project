import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { Category } from './entities/category.entity';
import * as moment from 'moment';
import { categoryPagination, CategoryStatus } from './enums/category.enums';
import { CategoryBanner } from './entities/category-banner.entity';
import { UpdateCategoryDto } from './dto/update-category-dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private CategoryRepository: Repository<Category>,

        @InjectRepository(CategoryBanner)
        private CategoryBannerRepository: Repository<CategoryBanner>,
        private cloudinaryService: CloudinaryService,
        
    ){}
    async create(createCategoryDto: CreateCategoryDto, files:any){        
        const currentDate= moment().format();
        const category=this.CategoryRepository.create({
          ...createCategoryDto,
          createdAt: currentDate
        });
        await this.CategoryRepository.save(category);
        for(let i = 0; i< files.length; i++){
            const resultFile = await this.cloudinaryService.uploadImage(files[i])
            console.log(resultFile);
            
            const categoryBanner = await this.CategoryBannerRepository.create({
                position: i + 1,
                url: resultFile.url,
                public_id: resultFile.public_id,
                category
            })
            await this.CategoryBannerRepository.save(categoryBanner);
        }
        return {
            statusCode: 200,
            message:'Create successfully',
            data: category
        };
    }
     async findCategoryById(id: string){
         const category = await this.CategoryRepository.findOne({id});
         if(!category){
             throw new NotFoundException(`Category with ${id} not found`)
         }
         return {
            statusCode: 200,
            message:'Search category successfully',
            data: category
        };
    }
    async addCategoryBanner(categoryId: string, files: any){
        const category = await this.CategoryRepository.findOne({id: categoryId});
        let count = await this.CategoryBannerRepository.count({category});
        for(let i =0; i< files.length; i++){            
            const categoryBanner = await this.CategoryBannerRepository.create({
                url: files[i].path,
                position: count + 1,
                category: category
            });
            count++
            await categoryBanner.save();
        }
        return {
            statusCode: 200,
            message:'Add category banner successfully',
        };
    } 
    async getCategoryById(id: string){
        const category = await this.CategoryRepository.createQueryBuilder('category')
                                                        .leftJoinAndSelect('category.categoryBanner','category_banner')
                                                        .where(`category.id = '${id}'`)
                                                        .orderBy('category_banner.position','ASC')
                                                        .getOne()
     return  category
    
    }
    
    async getCategory(getCategoryDto: GetCategoryDto){
        const {keyword, order, by, size, page}= getCategoryDto;
        
        let pageNumber =  page === undefined ? categoryPagination.PAGE : Number(page)  ;
        let sizePage = size === undefined ? categoryPagination.PAGE_SIZE: Number(size)  ; 
        console.log(sizePage);

        const query = await this.CategoryRepository.createQueryBuilder('category')
                            .leftJoinAndSelect('category.categoryBanner','category_banner')
                        .limit(sizePage)
                            .offset(sizePage*(pageNumber-1));
        if(keyword){
            query.andWhere(
                // 'MATCH(category.name) AGAINST(:keyword)',
                'category.name ILIKE :keyword',
                { keyword: `%${keyword}%` },
            )
        }
        if(order){
            if(by==='DESC') query.orderBy(`category.${order}`, 'DESC')
            else query.orderBy(`category.${order}`)
        }

        const result = await query.getMany();  
        const count = await query.getCount()        
        console.log('c',count);
        console.log(query.getSql());
        

        
        return {
            statusCode: 200,
            message:'Get category successfully',
            data: {result, pageNumber, totalPages: Math.ceil(count/sizePage)}
        };
    }
    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto){
        const {name, status} = updateCategoryDto;
        const category= await this.CategoryRepository.findOne(id);
        if(!category){
            throw new NotFoundException(`Category with ${id} not found`)
        }
        category.name= name;
        category.status= status;
        await this.CategoryRepository.save(category);
        return {statusCode:200,message:'Updated Successfully'}    
    }
    async deleteCategory(id:string){
        const categoryDelete = await this.CategoryRepository.findOne({id});
        const categoryBanner= await this.CategoryBannerRepository.find({categoryId: id})
                            // .innerJoinAndSelect('category.categoryBanner','category_banner');
        if(categoryDelete){
            await this.cloudinaryService.deleteCategoryBanner(categoryBanner);
            await this.CategoryBannerRepository.delete({categoryId: id});
            await this.CategoryRepository.delete(id);
            return {
                statusCode: 200,
                message: 'Delete category successfully'
            }
        }else {
            throw new NotFoundException(`Category ${id} not found`)
        }
    }
    async deleteBanner(id: string){
        let category = await this.CategoryBannerRepository.createQueryBuilder('category-banner')
                                                            .where(`category-banner.id = '${id}'`)
                                                            .getOne();
        const result=await this.CategoryBannerRepository.delete(id);        
        await this.cloudinaryService.deleteOne(category.public_id);
        if (result.affected === 0) {
          throw new NotFoundException(`Banner with ID "${id}" not found`);
        }    
        let categoryBannerRest = await this.CategoryBannerRepository.createQueryBuilder('category-banner')
                                                                    .where(`category-banner.categoryId = '${category.categoryId}'`)
                                                                    .getMany();        
        for(let i =0; i < categoryBannerRest.length; i++){
            let categoryBanner = await this.CategoryBannerRepository.create({
                id: categoryBannerRest[i].id,
                position: i+1,
                url: categoryBannerRest[i].url,
                public_id: categoryBannerRest[i].public_id
            })
            await categoryBanner.save()
        }
    }
    async changePositionBanner(){
        
    }
}
