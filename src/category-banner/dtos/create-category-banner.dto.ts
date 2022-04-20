import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';    
import { HasMimeType, IsFile, MaxFileSize } from "nestjs-form-data";


export class CreateCategoryBannerDto{
    
    @IsNotEmpty()
    @ApiProperty()
    position: number;
    // @IsFile()
    // @MaxFileSize(16)
    // @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
    url: any;
    categoryId:string;
}