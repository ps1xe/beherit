/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";

export const protobufPackage = "sound_generation";

export const SOUND_GENERATION_PACKAGE_NAME = "sound_generation";

export interface SoundGenerationServiceClient {
}

export interface SoundGenerationServiceController {
}

export function SoundGenerationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SoundGenerationService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SoundGenerationService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SOUND_GENERATION_SERVICE_NAME = "SoundGenerationService";
