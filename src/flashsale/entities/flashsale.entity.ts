import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemFlashsale } from "./item-flashsale.entity";

@Entity()
export class Flashsale extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;
    @Column({nullable: true})
    description: string;
    @Column({nullable: true})
    isSendMail: boolean;
    @Column({type:'timestamptz'})
    startSale: Date;
    @Column({type:'timestamptz'})
    endSale: Date;
    @Column({type:'timestamptz'})
    createdAt: Date;
    @Column({type:'timestamptz', nullable:true})
    updatedAt: Date;
    @OneToMany(_type => ItemFlashsale, itemFlashsale => itemFlashsale.flashsale)
    itemFlashsale: ItemFlashsale[]
}