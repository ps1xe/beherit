import { Injectable } from '@nestjs/common';
import { RegisterRequestDto } from '../dto/register-request.dto.js';
import { LoginRequestDto } from '../dto/login-request.dto.js';
import { ValidateRequestDto } from '../dto/validate-request.dto.js';
import { typeorm } from '../typeorm-connection.js';
import { User } from '@beherit/typeorm/entities/User';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from '@beherit/config';
import { RpcException } from '@nestjs/microservices';
import { ValidateResponseDto } from '../dto/validate-response.dto.js';
import { UpdateTokensDto } from '../dto/update-tokens-response.dto.js';
import { LoginResponseDto } from '../dto/login-response.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register({
    username,
    email,
    password,
  }: RegisterRequestDto): Promise<void> {
    const user = await typeorm.getRepository(User).findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new RpcException('Email already exists');
    }

    const salt = await bcrypt.genSalt(5);
    const encodePassword = bcrypt.hashSync(password, salt);

    const newUser = {
      email: email,
      username: username,
      password: encodePassword,
      refreshToken: 'The user has not logged on yet',
    };

    typeorm.getRepository(User).save(newUser);
  }

  async login({ email, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await typeorm.getRepository(User).findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new RpcException('Email not found');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException('Password wrong');
    }

    const token = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      { secret: config.JWT_SECRET_KEY, expiresIn: '30m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      { secret: config.JWT_REFRESH_SECRET_KEY, expiresIn: '60d' },
    );

    const salt = await bcrypt.genSalt(5);
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, salt);

    typeorm.getRepository(User).save({
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
    const decoded = this.jwtService.verify(token);
    if (!decoded) {
      throw new RpcException('Token is invalid');
    }

    const user = await typeorm.getRepository(User).findOne(decoded.id);
    if (!user) {
      throw new RpcException('User not found');
    }
    return { userId: decoded.id };
  }

  async updateTokens({ refreshToken }): Promise<UpdateTokensDto> {
    const decoded = await this.jwtService.verify(refreshToken);
    const user = await typeorm
      .getRepository(User)
      .findOne({ where: { id: decoded.id } });
    if (!user) {
      throw new RpcException('User not found');
    }

    const coincidenceTokens = bcrypt.compareSync(
      refreshToken,
      user.refreshToken,
    );

    if (!coincidenceTokens) {
      throw new RpcException('Refresh token invalid');
    }

    const updatedToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      { secret: config.JWT_SECRET_KEY, expiresIn: '30m' },
    );

    const updatedRefreshToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      { secret: config.JWT_REFRESH_SECRET_KEY, expiresIn: '60d' },
    );

    const salt = bcrypt.genSalt(5);
    const hashedUpdatedRefreshToken = bcrypt.hashSync(
      updatedRefreshToken,
      salt,
    );

    typeorm.getRepository(User).save({
      ...user,
      refreshToken: hashedUpdatedRefreshToken,
    });

    return { token: updatedToken, refreshToken: updatedRefreshToken };
  }
}
