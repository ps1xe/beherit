import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { User } from '@beherit/typeorm/entities/User';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from '@beherit/config';
import { RpcException } from '@nestjs/microservices';
import { ValidateResponseDto } from '../dto/validate-response.dto.js';
import { UpdateTokensResponseDto } from '../dto/update-tokens-response.dto.js';
import { LoginResponseDto } from '../dto/login-response.dto.js';
import { RegisterResponseDto } from '../dto/register-response.dto.js';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { typeorm } from '../typeorm-connection.js';

@Injectable()
export class AuthService implements OnModuleInit {
  private userRepository: Repository<User>;

  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit(): void {
    this.userRepository = typeorm.getRepository(User);
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<RegisterResponseDto> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new RpcException('Email already exists');
    }

    const salt = await bcrypt.genSalt(5);
    const encodePassword = await bcrypt.hashSync(password, salt);

    const token = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: email,
      },
      { secret: config.JWT_SECRET_KEY, expiresIn: '30m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: email,
      },
      { secret: config.JWT_REFRESH_SECRET_KEY, expiresIn: '60d' },
    );

    const hashedRefreshToken = await bcrypt.hashSync(refreshToken, salt);

    const newUser = {
      email: email,
      username: username,
      password: encodePassword,
      avatar: 'default_avatar.png',
      refreshToken: hashedRefreshToken,
    };

    this.userRepository.save(newUser);

    return { token: token, refreshToken: refreshToken };
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new RpcException('Email not found');
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException('Password wrong');
    }

    const token = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: user.email,
      },
      { secret: config.JWT_SECRET_KEY, expiresIn: '30m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: user.email,
      },
      { secret: config.JWT_REFRESH_SECRET_KEY, expiresIn: '60d' },
    );

    const salt = await bcrypt.genSalt(5);
    const hashedRefreshToken = await bcrypt.hashSync(refreshToken, salt);

    this.userRepository.save({
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
      refreshToken: hashedRefreshToken,
    });
    return {
      token: token,
      refreshToken: refreshToken,
    };
  }

  async validate(token: string): Promise<ValidateResponseDto> {
    const decoded = await this.jwtService.verify(token, {
      secret: config.JWT_SECRET_KEY,
    });
    if (!decoded) {
      throw new RpcException('Token is invalid');
    }

    const user = await this.userRepository.findOne({
      where: { email: decoded.email },
    });
    if (!user) {
      throw new RpcException('User not found');
    }
    return { userId: user.id };
  }

  async updateTokens(refreshToken: string): Promise<UpdateTokensResponseDto> {
    const decoded = await this.jwtService.verify(refreshToken, {
      secret: config.JWT_REFRESH_SECRET_KEY,
    });
    const user = await this.userRepository.findOne({
      where: { email: decoded.email },
    });
    if (!user) {
      throw new RpcException('User not found');
    }

    const coincidenceTokens = await bcrypt.compareSync(
      refreshToken,
      user.refreshToken,
    );

    if (!coincidenceTokens) {
      throw new RpcException('Refresh token invalid');
    }

    const updatedToken = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: user.email,
      },
      { secret: config.JWT_SECRET_KEY, expiresIn: '30m' },
    );

    const updatedRefreshToken = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: user.email,
      },
      { secret: config.JWT_REFRESH_SECRET_KEY, expiresIn: '60d' },
    );

    const salt = await bcrypt.genSalt(5);
    const hashedUpdatedRefreshToken = await bcrypt.hashSync(
      updatedRefreshToken,
      salt,
    );

    this.userRepository.save({
      ...user,
      refreshToken: hashedUpdatedRefreshToken,
    });

    return { token: updatedToken, refreshToken: updatedRefreshToken };
  }
}
