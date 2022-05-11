import { NotFoundException } from '@nestjs/common';
import * as moment from 'moment';
import { CategoryBanner } from 'src/category-banner/entities/category-banner.entity';
import { StatusCode } from 'src/common/status-code';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { Category } from './entities/category.entity';
import { CategoryStatus } from './enums/category.enums';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category>{
    async createCategory(createCategoryDto: CreateCategoryDto, files: any):Promise<Category>{
        const {name, status} = createCategoryDto;
        const currentDate= moment().format();
        const category=this.create({
          name, 
          status: CategoryStatus.ACTIVE,
          createdAt: currentDate
        });
    
        await this.save(category);
        return category;
    }
    async getCategory(getCategoryDto: GetCategoryDto):Promise<Category[]>{
        const {keyword, order, by, size, page}= getCategoryDto;
        const query = this.createQueryBuilder('category')
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
    async updateCategory(id:string, createCategoryDto: CreateCategoryDto){
        const {name, status} = createCategoryDto;
        const category= await this.findOne(id);
        if(!category){
            throw new NotFoundException(`Category with ${id} not found`)
        }
        category.name= name;
        category.status= status;
        await this.save(category);
        return {message:'Updated Successfully'}
    }
    async deleteCategory(id: string){
        console.log(id);
        
        const query = this.createQueryBuilder('category');
        const query2= this.createQueryBuilder('category_banner')
                            // .innerJoinAndSelect('category.categoryBanner','category_banner');
        const category= await this.findOne(id);
        if(category){
            await query2.delete()
                        .from(CategoryBanner)
                        .where('categoryId= :id', {id}).execute();
            await query.delete()
                        .from(Category)
                        .where('id= :id', {id}).execute();
        }else {
            throw new NotFoundException(`Category ${id} not found`)
        }
        console.log(query.getSql());
        console.log(query2.getSql());

        
                            
    }
}