import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "../enum/order-status.enum";

export class GetOrderDto{
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
    // @ApiProperty({enum: OrderStatus, required: false})
    // status: OrderStatus;
}