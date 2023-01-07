import { Injectable } from '@nestjs/common';
import { typeorm } from '@beherit/typeorm/typeorm-connection';
import { User } from '@beherit/typeorm/entities/User';

@Injectable()
export class AppService {
  async getUsers(): Promise<User[]> {
    const users = typeorm.getRepository(User).find();
    return users;
  }

  async createService(): Promise<User> {
    const user = typeorm.getRepository(User).save({});
    return user;
  }
}
