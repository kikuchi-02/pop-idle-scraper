import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TwitterAccount } from './TwitterAccount';

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'date' })
  date: string;

  @ManyToOne((type) => TwitterAccount, (account) => account.tweets)
  account: TwitterAccount;
}
