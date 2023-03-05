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
  pageOptions: PageOptionsDto | undefined;
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

/** FindOne */
export interface FindOneRequest {
  email: string;
}

export interface FindOneResponse {
  data?: User | undefined;
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
  order: Order | undefined;
  page: number;
  take: number;
}

export interface Order {
  ASC: string;
  DESC: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  getUrlToDownloadSound(request: GetUrlSoundRequest): Observable<GetUrlSoundResponse>;

  getListSounds(request: GetListSoundsRequest): Observable<GetListSoundsResponse>;

  changingAvatar(request: ChangingAvatarRequest): Observable<Void>;

  changePassword(request: ChangePasswordRequest): Observable<Void>;

  findOne(request: FindOneRequest): Observable<FindOneResponse>;

  save(request: PartialUser): Observable<User>;
}

export interface UserServiceController {
  getUrlToDownloadSound(
    request: GetUrlSoundRequest,
  ): Promise<GetUrlSoundResponse> | Observable<GetUrlSoundResponse> | GetUrlSoundResponse;

  getListSounds(
    request: GetListSoundsRequest,
  ): Promise<GetListSoundsResponse> | Observable<GetListSoundsResponse> | GetListSoundsResponse;

  changingAvatar(request: ChangingAvatarRequest): Promise<Void> | Observable<Void> | Void;

  changePassword(request: ChangePasswordRequest): Promise<Void> | Observable<Void> | Void;

  findOne(request: FindOneRequest): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;

  save(request: PartialUser): Promise<User> | Observable<User> | User;
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
