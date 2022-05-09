import { Category } from "src/category/entities/category.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CategoryBanner extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  position: number;
  @Column()
  url: string;
  @Column({nullable:true})
  categoryId: string;
  @ManyToOne(_type => Category, category => category.categoryBanner)
  @JoinColumn({referencedColumnName: 'id'})
  category: Category
}
