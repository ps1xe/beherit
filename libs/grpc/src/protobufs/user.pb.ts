/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface GetUrlSoundRequest {
  soundId: string;
}

export interface GetUrlSoundResponse {
  url: string;
}

export interface GetListSoundsRequest {
  userId: string;
}

export interface GetListSoundsResponse {
  sounds: string[];
}

export interface ChangingAvatarRequest {
  userId: string;
  avatar: Uint8Array;
  extension: string;
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface Empty {
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  getUrlToDownloadSound(request: GetUrlSoundRequest): Observable<GetUrlSoundResponse>;

  getListSounds(request: GetListSoundsRequest): Observable<GetListSoundsResponse>;

  changingAvatar(request: ChangingAvatarRequest): Observable<Empty>;

  changePassword(request: ChangePasswordRequest): Observable<Empty>;
}

export interface UserServiceController {
  getUrlToDownloadSound(
    request: GetUrlSoundRequest,
  ): Promise<GetUrlSoundResponse> | Observable<GetUrlSoundResponse> | GetUrlSoundResponse;

  getListSounds(
    request: GetListSoundsRequest,
  ): Promise<GetListSoundsResponse> | Observable<GetListSoundsResponse> | GetListSoundsResponse;

  changingAvatar(request: ChangingAvatarRequest): Promise<Empty> | Observable<Empty> | Empty;

  changePassword(request: ChangePasswordRequest): Promise<Empty> | Observable<Empty> | Empty;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getUrlToDownloadSound", "getListSounds", "changingAvatar", "changePassword"];
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
