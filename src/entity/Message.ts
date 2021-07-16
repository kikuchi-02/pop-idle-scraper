import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  created: Date;
}
