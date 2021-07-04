import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  EntitySubscriberInterface,
} from 'typeorm';

import { hash } from 'bcryptjs';

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

  async hashPassword(entity: User): Promise<void> {
    entity.password = await hash(entity.password, 10);
  }

  beforeInsert(event: InsertEvent<User>): Promise<void> {
    return this.hashPassword(event.entity);
  }

  async beforeUpdate({
    entity,
    databaseEntity,
  }: UpdateEvent<User>): Promise<void> {
    if (entity.password !== databaseEntity?.password) {
      await this.hashPassword(entity);
    }
  }
}
