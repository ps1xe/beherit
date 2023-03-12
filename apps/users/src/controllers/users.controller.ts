import {
  FindOneResponse,
  PartialUser,
  User,
  USER_SERVICE_NAME,
  Void,
} from '@beherit/grpc/protobufs/user.pb';
import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChangePasswordRequestDto } from '../dto/change-password-request.dto.js';
import { ChangingAvatarRequestDto } from '../dto/changing-avatar-request.dto.js';
import { FindOneDto } from '../dto/find-one.dto.js';
import { GetAvatarRequestDto } from '../dto/get-avatar-request.dto.js';
import { GetAvatarResponseDto } from '../dto/get-avatar-response.dto.js';
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
    pageOptions,
    userId,
  }: GetListSoundsRequsetDto): Promise<GetListSoundsResponseDto> {
    return this.userService.getListSounds(pageOptions, userId);
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
  async findOne({ email }: FindOneDto): Promise<FindOneResponse> {
    const user = await this.userService.findOne(email);
    return { data: user };
  }

  @GrpcMethod(USER_SERVICE_NAME, 'Save')
  async save(user: PartialUser): Promise<User> {
    return this.userService.save(user);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetAvatar')
  async getAvatar({
    email,
  }: GetAvatarRequestDto): Promise<GetAvatarResponseDto> {
    return this.userService.getAvatar(email);
  }
}
