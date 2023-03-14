import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  ChangingAvatarResponse,
  GetListSoundsResponse,
  UserServiceClient,
  USER_SERVICE_NAME,
  Void,
} from '@beherit/grpc/protobufs/user.pb';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { lastValueFrom } from 'rxjs';
import { PageOptionsDto } from '@beherit/common/pagination/dto/PageOptionsDto';

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

  @Get('getSounds')
  async getListSounds(
    @Req() request: Request,
    @Query() pageOptions: PageOptionsDto,
  ): Promise<GetListSoundsResponse> {
    const token = request.cookies.token;
    const { userId } = await this.authService.validate(token);
    const urls = await lastValueFrom(
      this.svc.getListSounds({
        pageOptions: pageOptions,
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
  ): Promise<ChangingAvatarResponse> {
    const token = request.cookies.token;
    const { userId } = await this.authService.validate(token);
    const buffer = avatar.buffer;
    const extension = avatar.originalname.split('.').pop();
    const url = await lastValueFrom(
      this.svc.changingAvatar({
        userId: userId,
        avatar: buffer,
        extension: extension,
      }),
    );
    return url;
  }

  @Post('changePassword')
  async changePassword(
    @Body() changePasswordBody,
    @Req() request: Request,
  ): Promise<Void> {
    const token = request.cookies.token;
    const { userId } = await this.authService.validate(token);
    return this.svc.changePassword({
      userId: userId,
      currentPassword: changePasswordBody.currentPassword,
      newPassword: changePasswordBody.newPassword,
    });
  }
}
