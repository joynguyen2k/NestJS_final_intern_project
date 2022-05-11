import { IsNotEmpty, IsNumber, IsNumberString, IsUUID } from "class-validator";

export class ItemFlashsaleDto{
    @IsNotEmpty()
    @IsNumberString()
    quantity: number;
    @IsNotEmpty()
    @IsNumberString()
    discount: number;
    // @IsUUID()
    itemsId: string
}