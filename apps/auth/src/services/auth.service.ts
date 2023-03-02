import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from '@beherit/config';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { ValidateResponseDto } from '../dto/validate-response.dto.js';
import { UpdateTokensResponseDto } from '../dto/update-tokens-response.dto.js';
import { LoginResponseDto } from '../dto/login-response.dto.js';
import { RegisterResponseDto } from '../dto/register-response.dto.js';
import { randomUUID } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service.js';
import { Void } from '@beherit/grpc/protobufs/auth.pb';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
} from '@beherit/grpc/protobufs/user.pb';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private svc: UserServiceClient;

  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(MailerService)
    private readonly mailerService: MailerService,
    @Inject(USER_SERVICE_NAME)
    private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.svc = this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  //----------------------------------------------------------------
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<RegisterResponseDto> {
    const user = await lastValueFrom(this.svc.findOne({ email: email }));

    if (user.data) {
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
      recoveryToken: 'null',
    };

    lastValueFrom(this.svc.save(newUser));

    return { token: token, refreshToken: refreshToken };
  }

  //----------------------------------------------------------------
  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await lastValueFrom(this.svc.findOne({ email }));

    if (!user) {
      throw new RpcException('Email not found');
    }

    const isPasswordValid = await bcrypt.compareSync(
      password,
      user.data.password,
    );
    if (!isPasswordValid) {
      throw new RpcException('Password wrong');
    }

    const token = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: user.data.email,
      },
      { secret: config.JWT_SECRET_KEY, expiresIn: '30m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: user.data.email,
      },
      { secret: config.JWT_REFRESH_SECRET_KEY, expiresIn: '60d' },
    );

    const salt = await bcrypt.genSalt(5);
    const hashedRefreshToken = await bcrypt.hashSync(refreshToken, salt);

    lastValueFrom(
      this.svc.save({
        ...user.data,
        refreshToken: hashedRefreshToken,
      }),
    );

    return {
      token: token,
      refreshToken: refreshToken,
    };
  }

  //----------------------------------------------------------------
  async validate(token: string): Promise<ValidateResponseDto> {
    const decoded = await this.jwtService.verify(token, {
      secret: config.JWT_SECRET_KEY,
    });
    if (!decoded) {
      throw new RpcException('Token is invalid');
    }

    const user = await lastValueFrom(
      this.svc.findOne({ email: decoded.email }),
    );

    if (!user) {
      throw new RpcException('User not found');
    }

    return { userId: user.data.id };
  }

  //----------------------------------------------------------------------------------
  async updateTokens(refreshToken: string): Promise<UpdateTokensResponseDto> {
    const decoded = await this.jwtService.verify(refreshToken, {
      secret: config.JWT_REFRESH_SECRET_KEY,
    });

    const user = await lastValueFrom(
      this.svc.findOne({ email: decoded.email }),
    );
    if (!user) {
      throw new RpcException('User not found');
    }

    const coincidenceTokens = await bcrypt.compareSync(
      refreshToken,
      user.data.refreshToken,
    );

    if (!coincidenceTokens) {
      throw new RpcException('Refresh token invalid');
    }

    const updatedToken = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: user.data.email,
      },
      { secret: config.JWT_SECRET_KEY, expiresIn: '30m' },
    );

    const updatedRefreshToken = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: user.data.email,
      },
      { secret: config.JWT_REFRESH_SECRET_KEY, expiresIn: '60d' },
    );

    const salt = await bcrypt.genSalt(5);
    const hashedUpdatedRefreshToken = await bcrypt.hashSync(
      updatedRefreshToken,
      salt,
    );

    lastValueFrom(
      this.svc.save({
        ...user.data,
        refreshToken: hashedUpdatedRefreshToken,
      }),
    );

    return { token: updatedToken, refreshToken: updatedRefreshToken };
  }

  //----------------------------------------------------------------
  async getLinkToResetPassword(email: string): Promise<Void> {
    const user = await lastValueFrom(this.svc.findOne({ email }));

    if (!user) {
      throw new RpcException('Email not found');
    }

    const tokenRecovery = await this.jwtService.signAsync(
      {
        id: randomUUID(),
        email: email,
      },
      { secret: config.JWT_RECOVERY_SECRET_KEY, expiresIn: '5m' },
    );

    const salt = await bcrypt.genSalt(5);
    const hashedRecoveryToken = await bcrypt.hashSync(tokenRecovery, salt);

    lastValueFrom(
      this.svc.save({
        ...user.data,
        recoveryToken: hashedRecoveryToken,
      }),
    );

    const url = `http://localhost:4000/auth/resetPassword/${tokenRecovery}`;

    this.mailerService
      .sendMail({
        to: email,
        subject: 'Восстановление пароля',
        // template: process.cwd() + '\\src\\mail-templates' + 'passwordRecovery',
        // context: {
        //   username: user.username,
        //   url: url,
        // },
        html: `<div> Доброго дня, ${user.data.username}.</div> <div>Для восстановления пароля пройдите пожалуйста по <a href = "${url}">ссылке</a></div>`,
      })
      .catch((exception) => {
        throw new RpcException(
          `Ошибка работы почты: ${JSON.stringify(exception)}`,
        );
      });

    return {};
  }

  //----------------------------------------------------------------
  async resetPassword(token: string, newPassword: string): Promise<Void> {
    const decoded = this.jwtService.verify(token, {
      secret: config.JWT_RECOVERY_SECRET_KEY,
    });

    const user = await lastValueFrom(
      this.svc.findOne({ email: decoded.email }),
    );

    if (!user) {
      throw new RpcException('User not found');
    }

    const coincidenceTokens = bcrypt.compareSync(
      token,
      user.data.recoveryToken,
    );

    if (!coincidenceTokens) {
      throw new RpcException('Recovery token invalid');
    }

    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hashSync(newPassword, salt);

    lastValueFrom(
      this.svc.save({
        ...user.data,
        password: hashedPassword,
        recoveryToken: 'null',
      }),
    );

    return {};
  }
}
