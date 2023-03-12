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
import { status } from '@grpc/grpc-js';

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
      throw new RpcException({
        message: 'Email already exists',
        code: status.ALREADY_EXISTS,
      });
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

    const avatar = await lastValueFrom(this.svc.getAvatar({ email }));

    const userInfo = {
      email: email,
      username: username,
      avatar: avatar.url,
    };

    return { token: token, refreshToken: refreshToken, userInfo: userInfo };
  }

  //----------------------------------------------------------------
  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await lastValueFrom(this.svc.findOne({ email }));

    if (!user) {
      throw new RpcException({
        message: 'Email not found',
        code: status.NOT_FOUND,
      });
    }

    const isPasswordValid = await bcrypt.compareSync(
      password,
      user.data.password,
    );
    if (!isPasswordValid) {
      throw new RpcException({
        message: 'Password wrong',
        code: status.UNAUTHENTICATED,
      });
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

    const avatar = await lastValueFrom(this.svc.getAvatar({ email }));

    const userInfo = {
      email: email,
      username: user.data.username,
      avatar: avatar.url,
    };

    return {
      token: token,
      refreshToken: refreshToken,
      userInfo: userInfo,
    };
  }

  //----------------------------------------------------------------
  async validate(token: string): Promise<ValidateResponseDto> {
    const decoded = await this.jwtService.verify(token, {
      secret: config.JWT_SECRET_KEY,
    });
    if (!decoded) {
      throw new RpcException({
        message: 'Token is invalid',
        code: status.UNAUTHENTICATED,
      });
    }

    const user = await lastValueFrom(
      this.svc.findOne({ email: decoded.email }),
    );

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND,
      });
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
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND,
      });
    }

    const coincidenceTokens = await bcrypt.compareSync(
      refreshToken,
      user.data.refreshToken,
    );

    if (!coincidenceTokens) {
      throw new RpcException({
        message: 'Refresh token invalid',
        code: status.UNAUTHENTICATED,
      });
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

    const email = user.data.email;
    const avatar = await lastValueFrom(this.svc.getAvatar({ email }));

    const userInfo = {
      email: user.data.email,
      username: user.data.username,
      avatar: avatar.url,
    };

    return {
      token: updatedToken,
      refreshToken: updatedRefreshToken,
      userInfo: userInfo,
    };
  }

  //----------------------------------------------------------------
  async getLinkToResetPassword(email: string): Promise<Void> {
    const user = await lastValueFrom(this.svc.findOne({ email }));

    if (!user) {
      throw new RpcException({
        message: 'Email not found',
        code: status.NOT_FOUND,
      });
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
        throw new RpcException({
          message: `Ошибка работы почты: ${JSON.stringify(exception)}`,
          code: status.INTERNAL,
        });
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
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND,
      });
    }

    const coincidenceTokens = bcrypt.compareSync(
      token,
      user.data.recoveryToken,
    );

    if (!coincidenceTokens) {
      throw new RpcException({
        message: 'Recovery token invalid',
        code: status.UNAUTHENTICATED,
      });
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
