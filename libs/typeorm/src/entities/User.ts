import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { Sound } from './Sound.js';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'username' })
  username!: string;

  @Column({ name: 'email' })
  email!: string;

  @Column({ name: 'password' })
  password!: string;

  @Column({ name: 'avatar' })
  avatar!: string;

  @Column({ name: 'refresh_token' })
  refreshToken!: string;

  @Column({ name: 'recovery_token' })
  recoveryToken!: string;

  @Column({ name: 'recovedry_token' })
  recoveryToen!: string;

  @OneToMany(() => Sound, (sounds) => sounds.user)
  sounds!: Relation<Sound>[];
}
