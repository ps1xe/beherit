/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface GetUrlSoundRequest {
  soundId: string;
}

export interface GetUrlSoundResponse {
  soundInfo: SoundInfo | undefined;
  url: string;
}

export interface GetListSoundsRequest {
  pageOptions: PageOptionsDto | undefined;
  userId: string;
}

export interface GetListSoundsResponse {
  soundsInfo: SoundInfo[];
  meta: PageMeta | undefined;
}

export interface ChangingAvatarRequest {
  userId: string;
  avatar: Uint8Array;
  extension: string;
}

export interface ChangingAvatarResponse {
  url: string;
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

/** FindOne */
export interface FindOneRequest {
  email: string;
}

export interface FindOneResponse {
  data?: User | undefined;
}

export interface GetAvatarRequset {
  email: string;
}

export interface GetAvatarResponse {
  url: string;
}

export interface GetUserProfileRequest {
  userId: string;
}

export interface GetUserProfileResponse {
  email: string;
  username: string;
  avatar: string;
}

export interface ChangeNicknameRequest {
  userId: string;
  newNickname: string;
}

export interface Void {
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string;
  recoveryToken: string;
}

export interface PartialUser {
  id?: string | undefined;
  username: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string;
  recoveryToken: string;
}

export interface PageOptionsDto {
  order?: string | undefined;
  page?: number | undefined;
  take?: number | undefined;
}

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface SoundInfo {
  name: string;
  genre: string;
  length: number;
  url: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  getUrlToDownloadSound(request: GetUrlSoundRequest): Observable<GetUrlSoundResponse>;

  getListSounds(request: GetListSoundsRequest): Observable<GetListSoundsResponse>;

  changingAvatar(request: ChangingAvatarRequest): Observable<ChangingAvatarResponse>;

  changePassword(request: ChangePasswordRequest): Observable<Void>;

  findOne(request: FindOneRequest): Observable<FindOneResponse>;

  save(request: PartialUser): Observable<User>;

  getUserProfile(request: GetUserProfileRequest): Observable<GetUserProfileResponse>;

  getAvatar(request: GetAvatarRequset): Observable<GetAvatarResponse>;

  changeNickname(request: ChangeNicknameRequest): Observable<Void>;
}

export interface UserServiceController {
  getUrlToDownloadSound(
    request: GetUrlSoundRequest,
  ): Promise<GetUrlSoundResponse> | Observable<GetUrlSoundResponse> | GetUrlSoundResponse;

  getListSounds(
    request: GetListSoundsRequest,
  ): Promise<GetListSoundsResponse> | Observable<GetListSoundsResponse> | GetListSoundsResponse;

  changingAvatar(
    request: ChangingAvatarRequest,
  ): Promise<ChangingAvatarResponse> | Observable<ChangingAvatarResponse> | ChangingAvatarResponse;

  changePassword(request: ChangePasswordRequest): Promise<Void> | Observable<Void> | Void;

  findOne(request: FindOneRequest): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;

  save(request: PartialUser): Promise<User> | Observable<User> | User;

  getUserProfile(
    request: GetUserProfileRequest,
  ): Promise<GetUserProfileResponse> | Observable<GetUserProfileResponse> | GetUserProfileResponse;

  getAvatar(request: GetAvatarRequset): Promise<GetAvatarResponse> | Observable<GetAvatarResponse> | GetAvatarResponse;

  changeNickname(request: ChangeNicknameRequest): Promise<Void> | Observable<Void> | Void;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getUrlToDownloadSound",
      "getListSounds",
      "changingAvatar",
      "changePassword",
      "findOne",
      "save",
      "getUserProfile",
      "getAvatar",
      "changeNickname",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
