/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "sounds";

export interface UploadSoundRequest {
  buffer: Uint8Array;
  userId: string;
}

export interface Void {
}

export const SOUNDS_PACKAGE_NAME = "sounds";

export interface SoundsServiceClient {
  uploadSound(request: UploadSoundRequest): Observable<Void>;
}

export interface SoundsServiceController {
  uploadSound(request: UploadSoundRequest): Promise<Void> | Observable<Void> | Void;
}

export function SoundsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["uploadSound"];
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
