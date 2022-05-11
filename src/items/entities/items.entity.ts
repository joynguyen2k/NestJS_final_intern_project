import { Category } from "src/category/entities/category.entity";
import { ItemFlashsale } from "src/flashsale/entities/item-flashsale.entity";
import { OrderDetail } from "src/order/entity/order-detail.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemsStatus } from "../items-status.enum";
import { ItemsImage } from "./items-image.entity";

@Entity()
export class Items extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({nullable:true})
  barcode: string;
  @Column({nullable:true,type:'float' })
  importPrice: number;
  @Column({nullable:true, type:'float'})
  price: number;
  @Column({nullable:true, type:'float'})
  priceNew: number;
  @Column({nullable:true, type:'float'})
  weight: number;
  @Column({nullable:true, type:'varchar'})
  avatar: string;
  @Column({nullable:true, type:'float'})
  quantity: number;
  @Column({nullable:true, type:'varchar'})
  description: string;
  @Column({nullable:true})
  status: ItemsStatus;
  @Column({nullable: true, default: false})
  isSale: Boolean;
  @Column({type: 'timestamptz', nullable: true})
  createdAt: Date;
  @Column({type: 'timestamptz', nullable: true})
  updatedAt: Date;
  @Column({nullable: true})
  categoryId: string;
  @ManyToOne(_type => Category, category => category.items)
  @JoinColumn({referencedColumnName: 'id'})
  category: Category
  @OneToMany(_type => ItemsImage, itemsImage=>itemsImage.items )
  @JoinColumn()
  itemsImage: ItemsImage[];
  @OneToMany(_type => ItemFlashsale, itemFlashsale=>itemFlashsale.items)
  @JoinColumn({referencedColumnName: 'itemsId'})
  itemFlashsale: ItemFlashsale[]
  @OneToMany(_type => OrderDetail, orderDetail => orderDetail.items )
  orderDetail: OrderDetail[]
}