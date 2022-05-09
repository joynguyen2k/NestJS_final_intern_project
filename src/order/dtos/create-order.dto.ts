import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsUUID } from "class-validator";
import { OrderStatus } from "../enum/order-status.enum";
class ItemOrder{
    @IsUUID()
    itemsId: string;
    @IsNumber()
    @Type(()=>Number)
    quantity: number;
}
export class CreateOrderDto{
    code: string;
    address: string;
    itemOrder: ItemOrder[]
}