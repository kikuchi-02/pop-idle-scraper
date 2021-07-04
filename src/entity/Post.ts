import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Idle } from './Idle';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ type: 'date' })
  created: string;

  @ManyToOne((type) => Idle, (author) => author.posts)
  author: Idle;
}
