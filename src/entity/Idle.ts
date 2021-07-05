import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IdleGroupActivity } from './IdleGroupActivity';
import { Post } from './Post';

export type BloodType = 'A' | 'B' | 'O' | 'AB';

@Entity()
export class Idle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthday: string;

  @Column({ nullable: true })
  tall: number;

  @Column({
    type: 'enum',
    enum: ['A', 'B', 'O', 'AB'],
    nullable: true,
  })
  bloodType: BloodType;

  @Column({ nullable: true })
  originPrefecture: string;

  @Column({
    type: 'varchar',
    array: true,
    nullable: true,
  })
  otherNames: string[];

  @OneToMany((type) => Post, (post) => post.author)
  posts: Post[];

  @ManyToMany(
    (type) => IdleGroupActivity,
    (idleGroupActivity) => idleGroupActivity.idle
  )
  groupActivities: IdleGroupActivity[];
}
