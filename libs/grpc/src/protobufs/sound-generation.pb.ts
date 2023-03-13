/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "ml";

/** Generate */
export interface GenerateRequest {
  name: string;
  genre: string;
  length: number;
  userId: string;
}

export interface GenerateResponse {
  url: string;
}

/** Common message */
export interface Void {
}

export const ML_PACKAGE_NAME = "ml";

export interface MlServiceClient {
  generate(request: GenerateRequest): Observable<GenerateResponse>;
}

export interface MlServiceController {
  generate(request: GenerateRequest): Promise<GenerateResponse> | Observable<GenerateResponse> | GenerateResponse;
}

export function MlServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["generate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MlService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MlService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ML_SERVICE_NAME = "MlService";
