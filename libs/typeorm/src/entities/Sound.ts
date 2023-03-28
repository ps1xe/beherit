import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { User } from './User.js';

@Entity('sound')
export class Sound extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'key' })
  key!: string;

  @Column({ name: 'genre' })
  genre!: string;

  @Column({ name: 'length' })
  length: number;

  @Column()
  userId!: User['id'];

  @Column({ name: 'loaded' })
  loaded: boolean;

  @ManyToOne(() => User, (user) => user.sounds)
  user!: Relation<User>;
}
