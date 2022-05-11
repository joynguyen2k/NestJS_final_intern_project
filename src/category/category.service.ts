import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { Category } from './entities/category.entity';
import * as moment from 'moment';
import { CategoryStatus } from './enums/category.enums';
import { CategoryBanner } from './entities/category-banner.entity';
import { url } from 'inspector';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private CategoryRepository: Repository<Category>,

        @InjectRepository(CategoryBanner)
        private CategoryBannerRepository: Repository<CategoryBanner>
    ){}
    async create(createCategoryDto: CreateCategoryDto, files:any){
        const {name, status} = createCategoryDto;
        const currentDate= moment().format();
        const category=this.CategoryRepository.create({
          name, 
          status: CategoryStatus.ACTIVE,
          createdAt: currentDate
        });
        await this.CategoryRepository.save(category);
        for(let i = 0; i< files.length; i++){
            const categoryBanner = await this.CategoryBannerRepository.create({
                position: i,
                url: files[i],
                category
            })
            await this.CategoryBannerRepository.save(categoryBanner);
        }
        return category;   
     }
    async getCategoryById(id: string): Promise<Category>{
        return this.CategoryRepository.findOne({where:id})
    }
    async getCategory(getCategoryDto: GetCategoryDto):Promise<Category[]>{
        const {keyword, order, by, size, page}= getCategoryDto;
        const query = this.CategoryRepository.createQueryBuilder('category')
                            .leftJoinAndSelect('category.categoryBanner','category_banner')
                            .orderBy('category_banner.position')
                            ;
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
            // query.andWhere(
            //     // 'MATCH(category.name) AGAINST(:keyword)',
            //     'ORDER BY :order',
            //     { order: `${order}` },
            // )
        }
        if(size){
            if(page) {query.limit(Number(size)); query.offset(Number(size*(page-1))) } 
            else {query.limit(Number(size)); query.offset(0) } 
        }else {
            if(page) {query.limit(Number(8)); query.offset(Number(8*(page-1))) } 
            else {query.limit(Number(8)); query.offset(0) } 
        }

        const result = await query.getMany();
        console.log(query.getSql());
        
        return result;
    }
    async updateCategory(id: string, createCategoryDto: CreateCategoryDto){
        const {name, status} = createCategoryDto;
        const category= await this.CategoryRepository.findOne(id);
        if(!category){
            throw new NotFoundException(`Category with ${id} not found`)
        }
        category.name= name;
        category.status= status;
        await this.CategoryRepository.save(category);
        return {message:'Updated Successfully'}    }
    async deleteCategory(id:string){
        const query = this.CategoryRepository.createQueryBuilder('category');
        const query2= this.CategoryBannerRepository.createQueryBuilder('category_banner')
                            // .innerJoinAndSelect('category.categoryBanner','category_banner');
        const category= await this.CategoryRepository.findOne(id);
        if(category){
            await query2.delete()
                        .where('categoryId= :id', {id}).execute();
            await query.delete()
                        .where('id= :id', {id}).execute();
        }else {
            throw new NotFoundException(`Category ${id} not found`)
        }
        console.log(query.getSql());
        console.log(query2.getSql());
    }
}
