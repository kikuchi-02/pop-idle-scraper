import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  token: string;

  @Column({ type: 'timestamp' })
  expiryDate: Date;

  @ManyToOne((type) => User, (user) => user.refreshTokens)
  user: User;

  verifyExpiration(): boolean {
    return new Date() < this.expiryDate;
  }
}
