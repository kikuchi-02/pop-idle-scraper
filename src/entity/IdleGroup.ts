import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IdleGroupActivity } from './IdleGroupActivity';

@Entity()
export class IdleGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  start: string;

  @Column({ type: 'date', nullable: true })
  end: string;

  @ManyToMany(
    (type) => IdleGroupActivity,
    (groupActivity) => groupActivity.idleGroups
  )
  groupsActivities: IdleGroupActivity[];
}
