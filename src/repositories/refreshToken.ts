import { EntityRepository, Repository } from 'typeorm';
import { RefreshToken } from '../entity/RefreshToken';
import { User } from '../entity/User';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  createAndSave(user: User, expiryHours: number) {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    const now = new Date();
    refreshToken.expiryDate = new Date(now.getTime() + 1000 * 60 * expiryHours);
    return this.manager.save(refreshToken);
  }

  findByToken(token: string) {
    return this.findOne(token, { relations: ['user'] });
  }
}
