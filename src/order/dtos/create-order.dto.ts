import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsUUID } from "class-validator";
import { OrderStatus } from "../enum/order-status.enum";
class ItemOrder{
    @ApiProperty({type: String, required: false})
    @IsUUID()
    itemsId: string;
    @ApiProperty({type: String, required: false})
    @IsNumber()
    @Type(()=>Number)
    quantity: number;
}
export class CreateOrderDto{
    @ApiProperty({type: String, required: false})
    code: string;
    @ApiProperty({type: String, required: true})
    address: string;
    @ApiProperty({type: 'array', items: { type: 'string'}})
    itemOrder: ItemOrder[]
}