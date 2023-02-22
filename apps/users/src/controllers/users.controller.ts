import { Empty, USER_SERVICE_NAME } from '@beherit/grpc/protobufs/user.pb';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChangePasswordRequestDto } from '../dto/change-password-request.dto.js';
import { ChangingAvatarRequestDto } from '../dto/changing-avatar-request.dto.js';
import { GetListSoundsRequsetDto } from '../dto/get-list-sounds-request.dto.js';
import { GetListSoundsResponseDto } from '../dto/get-list-sounds-response.dto.js';
import { GetUrlToDownloadRequestDto } from '../dto/get-url-request.dto.js';
import { GetUrlToDownloadResponseDto } from '../dto/get-url-response.dto.js';
import { UsersService } from '../services/users.service.js';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'GetUrlToDownloadSound')
  async getUrlToDownloadSound({
    soundId,
  }: GetUrlToDownloadRequestDto): Promise<GetUrlToDownloadResponseDto> {
    return this.userService.getUrlToDownloadSound(soundId);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetListSounds')
  async getListSounds({
    userId,
  }: GetListSoundsRequsetDto): Promise<GetListSoundsResponseDto> {
    return this.userService.getListSounds(userId);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ChangingAvatar')
  async changingAvatar({
    userId,
    avatar,
    extension,
  }: ChangingAvatarRequestDto): Promise<Empty> {
    return this.userService.changingAvatar(userId, avatar, extension);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ChangePassword')
  async changePassword({
    userId,
    currentPassword,
    newPassword,
  }: ChangePasswordRequestDto): Promise<Empty> {
    return this.userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }
}
