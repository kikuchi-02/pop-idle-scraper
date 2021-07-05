import bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ENV_SETTINGS } from '../conf';
import { RefreshToken } from './RefreshToken';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, ENV_SETTINGS.SALT_ROUND);
  }

  @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
