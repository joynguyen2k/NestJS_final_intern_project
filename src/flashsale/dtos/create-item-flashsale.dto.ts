import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsUUID } from "class-validator";

export class ItemFlashsaleDto{
    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty({type: String, required: false})
    quantity: number;
    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty({type: String, required: false})
    discount: number;
    // @IsUUID()
    @ApiProperty({type: String})
    itemsId: string
}