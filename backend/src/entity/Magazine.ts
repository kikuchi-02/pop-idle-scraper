import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MagazineNote } from './MagazineNote';

@Entity()
export class Magazine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  publish_date: number;

  @Column()
  publish_month: number;

  @Column()
  publish_week: number;

  @OneToMany((type) => MagazineNote, (note) => note.magazine)
  notes: MagazineNote[];
}
