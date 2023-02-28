import {
  PartialUser,
  User,
  USER_SERVICE_NAME,
  Void,
} from '@beherit/grpc/protobufs/user.pb';
import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChangePasswordRequestDto } from '../dto/change-password-request.dto.js';
import { ChangingAvatarRequestDto } from '../dto/changing-avatar-request.dto.js';
import { findOneDto } from '../dto/find-one.dto.js';
import { GetListSoundsRequsetDto } from '../dto/get-list-sounds-request.dto.js';
import { GetListSoundsResponseDto } from '../dto/get-list-sounds-response.dto.js';
import { GetUrlToDownloadRequestDto } from '../dto/get-url-request.dto.js';
import { GetUrlToDownloadResponseDto } from '../dto/get-url-response.dto.js';
import { RpcExceptionFilter } from '../filters/rpc-exception.filter.js';
import { UsersService } from '../services/users.service.js';

@UseFilters(new RpcExceptionFilter())
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
  }: ChangingAvatarRequestDto): Promise<Void> {
    return this.userService.changingAvatar(userId, avatar, extension);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ChangePassword')
  async changePassword({
    userId,
    currentPassword,
    newPassword,
  }: ChangePasswordRequestDto): Promise<Void> {
    return this.userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }

  @GrpcMethod(USER_SERVICE_NAME, 'FindOne')
  async findOne({ email }: findOneDto): Promise<User | null> {
    return this.userService.findOne(email);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'Save')
  async save(user: PartialUser): Promise<User> {
    return this.userService.save(user);
  }
}
