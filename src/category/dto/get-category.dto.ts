import { IsOptional, IsString } from "class-validator";

export class GetCategoryDto{
    @IsOptional()
    @IsString()
    keyword:string;
    order: string;
    by:string;
    size: number;
    page:number;

    
}