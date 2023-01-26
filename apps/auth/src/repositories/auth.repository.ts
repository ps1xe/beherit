import { HttpStatus, Injectable } from '@nestjs/common';
import {
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from '@beherit/grpc/protobufs/auth.pb';
import { RegisterRequestDto } from '../dto/register-request.dto.js';
import { LoginRequestDto } from '../dto/login-request.dto.js';
import { ValidateRequestDto } from '../dto/validate-request.dto.js';
import { typeorm } from '../typeorm-connection.js';
import { User } from '@beherit/typeorm/entities/User';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from '@beherit/config';

@Injectable()
export class AuthRepository {
  constructor(private readonly jwtService: JwtService) {}

  async register({
    username,
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    const user = await typeorm.getRepository(User).findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      return { status: HttpStatus.CONFLICT, error: ['Email already exists'] };
    }

    const encodePassword = bcrypt.hashSync(password, config.HASH_SALT);

    typeorm.getRepository(User).save({ email, username, encodePassword });

    return { status: HttpStatus.CREATED, error: null };
  }

  async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
    const user = await typeorm.getRepository(User).findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        token: null,
        error: ['Email not found'],
      };
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return {
        status: HttpStatus.NOT_FOUND,
        token: null,
        error: ['Password wrong'],
      };
    }

    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });
    return { status: HttpStatus.OK, token: token, error: null };
  }

  async validate({ token }: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded = this.jwtService.verify(token);
    if (!decoded) {
      return {
        status: HttpStatus.CONFLICT,
        userId: null,
        error: ['Token is invalid'],
      };
    }

    const user = await typeorm.getRepository(User).findOne(decoded.id);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        userId: null,
        error: ['User not found'],
      };
    }
    return { status: HttpStatus.OK, userId: decoded.id, error: null };
  }
}
