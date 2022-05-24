import { Category } from "src/category/entities/category.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CategoryBanner extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false})
  position: number;
  @Column({ nullable: false})
  url: string;
  @Column({nullable: true})
  public_id: string;
  @Column({nullable:true})
  categoryId: string;
  @ManyToOne(_type => Category, category => category.categoryBanner)
  @JoinColumn({referencedColumnName: 'id'})
  category: Category
}
