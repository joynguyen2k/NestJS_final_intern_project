import { Items } from "src/items/entities/items.entity";
import { OrderDetail } from "src/order/entity/order-detail.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flashsale } from "./flashsale.entity";

@Entity()
export class ItemFlashsale extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({nullable: true})
    quantity: number;
    @Column({nullable: true})
    discount: number;
    @Column({nullable: true})
    itemsId: string;
    @ManyToOne(_type => Flashsale, flashsale => flashsale.itemFlashsale)
    flashsale: Flashsale
    @ManyToOne(_type => Items, items=>items.itemFlashsale)
    @JoinColumn({referencedColumnName: 'id'})
    items: Items;
    @OneToMany(_type=>OrderDetail, orderDetail => orderDetail.itemFlashsale)
    orderDetail: OrderDetail[]
}