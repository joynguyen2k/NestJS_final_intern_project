import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetItemDto{
    @IsOptional()
    @IsString()
    @ApiProperty({type: String, required:false})
    keyword:string;
    @ApiProperty({type: String, required:false})
    order: string;
    @ApiProperty({type: String, required:false})
    by:string;
    @ApiProperty({type: Number, required:false})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    size: number;
    @ApiProperty({type: Number, required:false})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page:number;
}