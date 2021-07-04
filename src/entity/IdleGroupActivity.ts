import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Idle } from './Idle';
import { IdleGroup } from './IdleGroup';

@Entity()
export class IdleGroupActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  joinDate: string;

  @Column({ type: 'date', nullable: true })
  leaveDate: string;

  @OneToMany((type) => Idle, (idle) => idle.groupActivities)
  idle: Idle;

  @ManyToMany((type) => IdleGroup, (idleGroup) => idleGroup.groupsActivities)
  @JoinTable()
  idleGroups: IdleGroup[];
}
