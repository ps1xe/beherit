/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "sounds";

export interface UploadSoundRequest {
  buffer: Uint8Array;
  userId: string;
}

export interface FindOneRequest {
  soundId: string;
}

export interface FindRequest {
  userId: string;
}

export interface FindResponse {
  sounds: Sound[];
}

export interface Void {
}

export interface Sound {
  id: string;
  key: string;
  userId: string;
}

export const SOUNDS_PACKAGE_NAME = "sounds";

export interface SoundsServiceClient {
  uploadSound(request: UploadSoundRequest): Observable<Void>;

  findOne(request: FindOneRequest): Observable<Sound>;

  find(request: FindRequest): Observable<FindResponse>;
}

export interface SoundsServiceController {
  uploadSound(request: UploadSoundRequest): Promise<Void> | Observable<Void> | Void;

  findOne(request: FindOneRequest): Promise<Sound> | Observable<Sound> | Sound;

  find(request: FindRequest): Promise<FindResponse> | Observable<FindResponse> | FindResponse;
}

export function SoundsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["uploadSound", "findOne", "find"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SoundsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SoundsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SOUNDS_SERVICE_NAME = "SoundsService";
