import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  Empty,
  GetListSoundsResponse,
  UserServiceClient,
  USER_SERVICE_NAME,
} from '@beherit/grpc/protobufs/user.pb';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { lastValueFrom } from 'rxjs';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController implements OnModuleInit {
  private svc: UserServiceClient;

  constructor(
    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  onModuleInit(): void {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  @Post('getUrl/:id')
  async getUrlToDownloadSound(@Param('id') id: string): Promise<string> {
    const getUrlObject = await lastValueFrom(
      this.svc.getUrlToDownloadSound({ soundId: id }),
    );
    return getUrlObject.url;
  }

  @Get('getSounds')
  async getListSounds(@Req() request: Request): Promise<GetListSoundsResponse> {
    const token = request.cookies.token;
    const { userId } = await this.authService.validate(token);
    const urls = await lastValueFrom(
      this.svc.getListSounds({
        userId: userId,
      }),
    );
    return urls;
  }

  @Post('changingAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async changingAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() request: Request,
  ): Promise<Empty> {
    const token = request.cookies.token;
    const { userId } = await this.authService.validate(token);
    const buffer = avatar.buffer;
    const extension = avatar.originalname.split('.').pop();
    return this.svc.changingAvatar({
      userId: userId,
      avatar: buffer,
      extension: extension,
    });
  }

  @Post('changePassword')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() request: Request,
  ): Promise<Empty> {
    const token = request.cookies.token;
    const { userId } = await this.authService.validate(token);
    return this.svc.changePassword({
      userId: userId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });
  }
}
