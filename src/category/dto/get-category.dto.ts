import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetCategoryDto{
    @IsOptional()
    @IsString()
    @ApiProperty({type: String, required:false})
    keyword:string;
    @ApiProperty({type: String, required:false})
    order: string;
    @ApiProperty({type: String, required:false})
    by:string;
    @ApiProperty({type: Number, required:false})
    size: number;
    @ApiProperty({type: Number, required:false})
    page:number;

    
}