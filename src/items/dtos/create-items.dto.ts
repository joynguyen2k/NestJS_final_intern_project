import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ItemsStatus } from "../items-status.enum";

export class CreateItemsDto{
    @IsString()
    @IsNotEmpty()
    name: string;
    barcode: string;
    importPrice: number;
    price: number;
    weight: number;
    avatar: any;
    quantity: number;
    description: string;
    createdAt: Date;
    categoryId: string;
    @IsOptional()
    @IsEnum(ItemsStatus)
    status: ItemsStatus;
}