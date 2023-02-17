import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { User } from './User.js';

@Entity('sound')
export class Sound extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'key' })
  key!: string;

  @Column({ name: 'userId' })
  userId!: string;
  // userId!: User['id'];

  // @ManyToOne(() => User, (user) => user.sounds)
  // user!: User;
}
