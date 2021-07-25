import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Script } from './Script';
import { User } from './User';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Script, (script) => script.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  script: Script;

  @Column()
  body: string;

  @ManyToOne((type) => User, (user) => user.messages)
  author: User;

  @CreateDateColumn()
  created: Date;

  @Column('uuid', { nullable: true })
  uuid: string;

  @ManyToOne((type) => Message, (message) => message.children, {
    nullable: true,
  })
  parent: Message;

  @OneToMany((type) => Message, (message) => message.parent)
  children: Message[];
}
