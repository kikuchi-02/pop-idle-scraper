import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './Message';
import { User } from './User';

// from quill
export interface StringMap {
  [key: string]: any;
}
export interface OptionalAttributes {
  attributes?: StringMap;
}
export type DeltaOperation = {
  insert?: any;
  delete?: number;
  retain?: number;
} & OptionalAttributes;

@Entity()
export class Script {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'json', default: [] })
  deltaOps: DeltaOperation[];

  @ManyToOne((type) => User, (user) => user.scripts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToMany((type) => Message, (message) => message.script)
  messages: Message[];
}
