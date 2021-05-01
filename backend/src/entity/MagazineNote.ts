import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Magazine } from './Magazine';

@Entity()
export class MagazineNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne((type) => Magazine, (magazine) => magazine.notes)
  magazine: Magazine;
}
