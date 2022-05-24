import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { CategoryStatus } from "../enums/category.enums";

export class UpdateCategoryDto{
    @ApiProperty({type: String, required: false})
    name:string;
    @IsOptional()
    @IsEnum(CategoryStatus)
    @ApiProperty({enum:CategoryStatus, required: false})

    status: CategoryStatus;
    // @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
    // files: any;
}