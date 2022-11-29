import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service.js';
import { User } from '@beherit/typeorm/entities/User';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.appService.getUsers();
  }

  @Post()
  async createUser(): Promise<User> {
    return this.appService.createService();
  }
}
