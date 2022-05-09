import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { CategoryStatus } from "../enums/category.enums";

export class CreateCategoryDto{
    @IsNotEmpty()
    @ApiProperty({type: String})
    name:string;
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(CategoryStatus)
    @ApiProperty({enum:CategoryStatus})

    status: CategoryStatus;
}