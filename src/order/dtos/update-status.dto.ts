import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "../enum/order-status.enum";

export class UpdateStatusOrderDto{
    @IsString()
    @IsOptional()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}