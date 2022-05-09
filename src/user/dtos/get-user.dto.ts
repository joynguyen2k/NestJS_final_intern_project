import { IsEnum, IsOptional, IsString } from "class-validator";

export class GetUserDto{
    @IsOptional()
    @IsString()
    keyword:string;
    order: string;
    by:string;
    size: number;
    page:number;

    
}