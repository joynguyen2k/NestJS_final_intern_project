import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { CategoryStatus } from "../enums/category.enums";

export class CreateCategoryDto{
    @IsNotEmpty()
    name:string;
    @IsOptional()
    @IsNotEmpty()
    status: CategoryStatus;
}