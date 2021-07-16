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

  @Column()
  innerHtml: string;

  @ManyToOne((type) => User, (user) => user.scripts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToMany((type) => Message, (message) => message.script)
  messages: Message[];
}
