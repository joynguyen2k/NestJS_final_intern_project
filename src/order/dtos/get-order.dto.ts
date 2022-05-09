import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "../enum/order-status.enum";

export class GetOrderDto{
    @IsOptional()
    @IsString()
    keyword:string;
    order: string;
    by:string;
    size: number;
    page:number;
    @IsOptional()
    @IsString()
    status: OrderStatus;
    
}