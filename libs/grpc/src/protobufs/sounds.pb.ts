/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "sounds";

export interface FindOneRequest {
  soundId: string;
}

export interface FindOneResponse {
  data?: Sound | undefined;
}

export interface SaveRequest {
  key: string;
  genre: string;
  userId: string;
  length: number;
}

export interface SaveResponse {
  data: Sound | undefined;
}

export interface FindRequest {
  pageOptions: PageOptionsDto | undefined;
  userId: string;
}

export interface FindResponse {
  sounds: Sound[];
  meta: PageMeta | undefined;
}

export interface Void {
}

export interface Sound {
  id: string;
  key: string;
  userId: string;
  genre: string;
  length: number;
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

export const SOUNDS_PACKAGE_NAME = "sounds";

export interface SoundsServiceClient {
  findOne(request: FindOneRequest): Observable<FindOneResponse>;

  find(request: FindRequest): Observable<FindResponse>;

  save(request: SaveRequest): Observable<SaveResponse>;
}

export interface SoundsServiceController {
  findOne(request: FindOneRequest): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;

  find(request: FindRequest): Promise<FindResponse> | Observable<FindResponse> | FindResponse;

  save(request: SaveRequest): Promise<SaveResponse> | Observable<SaveResponse> | SaveResponse;
}

export function SoundsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne", "find", "save"];
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
