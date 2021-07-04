import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tweet } from './Tweet';

@Entity()
export class TwitterAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  profileName: string;

  @OneToMany((type) => Tweet, (tweet) => tweet.account)
  tweets: Tweet[];
}
