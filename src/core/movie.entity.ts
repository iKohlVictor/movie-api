import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Movie {
  @PrimaryColumn()
  id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column()
  release_date: Date;

  @Column()
  rating: number;

  @Column()
  category_id: string;
}
