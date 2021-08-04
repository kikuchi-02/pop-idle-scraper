import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WordInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  word: string;

  @Column()
  pronunciation: string;
}
