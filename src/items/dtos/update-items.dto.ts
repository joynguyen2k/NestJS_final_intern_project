import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ItemsStatus } from "../items-status.enum";

export class UpdateItemsDto{
    name: string;
    barcode: string;
    importPrice: number;
    price: number;
    weight: number;
    avatar: any;
    quantity: number;
    description: string;
    updatedAt: Date;
    @IsOptional()
    @IsEnum(ItemsStatus)
    status: ItemsStatus;
}