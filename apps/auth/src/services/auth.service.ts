import { Injectable } from '@nestjs/common';
import { RegisterRequestDto } from '../dto/register-request.dto.js';
import { LoginRequestDto } from '../dto/login-request.dto.js';
import { ValidateRequestDto } from '../dto/validate-request.dto.js';
import { User } from '@beherit/typeorm/entities/User';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from '@beherit/config';
import { RpcException } from '@nestjs/microservices';
import { ValidateResponseDto } from '../dto/validate-response.dto.js';
import { UpdateTokensDto } from '../dto/update-tokens-response.dto.js';
import { LoginResponseDto } from '../dto/login-response.dto.js';
import { RegisterResponseDto } from '../dto/register-response.dto.js';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  userRepository: Repository<User>;

  constructor(private readonly jwtService: JwtService) {
    this.userRepository = this.userRepository;
  }

  async register({
    username,
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponseDto> {
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
      refreshToken: hashedRefreshToken,
    };

    this.userRepository.save(newUser);

    return { token: token, refreshToken: refreshToken };
  }

  async login({ email, password }: LoginRequestDto): Promise<LoginResponseDto> {
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

  async validate({ token }: ValidateRequestDto): Promise<ValidateResponseDto> {
    const decoded = this.jwtService.verify(token, {
      secret: config.JWT_REFRESH_SECRET_KEY,
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

  async updateTokens({ refreshToken }): Promise<UpdateTokensDto> {
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
