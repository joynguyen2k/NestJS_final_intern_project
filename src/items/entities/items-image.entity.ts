import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Items } from "./items.entity";

@Entity()
export class ItemsImage extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    url: string;
    @Column()
    itemsId:string;
    @ManyToOne(_type=> Items, items => items.itemsImage)
    items: Items
}