import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(() => Sound, (sounds) => sounds.user)
  sounds!: Sound[];
}
