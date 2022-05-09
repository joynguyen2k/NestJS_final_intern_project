import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class ItemFlashsaleDto{
    // @IsNotEmpty()
    // @IsNumber()
    quantity: number;
    // @IsNotEmpty()
    // @IsNumber()
    discount: number;
    // @IsUUID()
    itemsId: string
}