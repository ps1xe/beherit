import { DataSource } from 'typeorm';
import { config } from '@beherit/config';
import { User } from './entities/User.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.DATABASE_URL,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
});
