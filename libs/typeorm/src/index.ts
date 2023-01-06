import { DataSource } from 'typeorm';
import { config } from '@beherit/config';
import { User } from './entities/User.js';
import { Sound } from './entities/Sound.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.DATABASE_URL,
  entities: [User, Sound],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
});
