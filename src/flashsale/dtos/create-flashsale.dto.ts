import { ItemFlashsaleDto } from "./create-item-flashsale.dto";

export class CreateFlashsaleDto{
    name: string;
    description: string;
    startSale: Date;
    endSale: Date;
    createdAt: Date;
    itemFlashsale:ItemFlashsaleDto[]
}