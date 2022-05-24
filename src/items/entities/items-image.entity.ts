import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Items } from "./items.entity";

@Entity()
export class ItemsImage extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({nullable: true})
    url: string;
    @Column({nullable: true})
    public_id: string;
    @Column({nullable: true})
    itemsId:string;
    @ManyToOne(_type=> Items, items => items.itemsImage)
    items: Items
}