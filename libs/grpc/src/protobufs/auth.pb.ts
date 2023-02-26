/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  refreshToken: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  refreshToken: string;
  token: string;
}

export interface ValidateRequest {
  token: string;
}

export interface ValidateResponse {
  userId: string;
}

export interface UpdateTokensRequest {
  refreshToken: string;
}

export interface UpdateTokensResponse {
  refreshToken: string;
  token: string;
}

export interface GetLinkToResetPasswordRequest {
  email: string;
}

export interface Void {
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  register(request: RegisterRequest): Observable<RegisterResponse>;

  login(request: LoginRequest): Observable<LoginResponse>;

  validate(request: ValidateRequest): Observable<ValidateResponse>;

  updateTokens(request: UpdateTokensRequest): Observable<UpdateTokensResponse>;

  getLinkToResetPassword(request: GetLinkToResetPasswordRequest): Observable<Void>;
}

export interface AuthServiceController {
  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  validate(request: ValidateRequest): Promise<ValidateResponse> | Observable<ValidateResponse> | ValidateResponse;

  updateTokens(
    request: UpdateTokensRequest,
  ): Promise<UpdateTokensResponse> | Observable<UpdateTokensResponse> | UpdateTokensResponse;

  getLinkToResetPassword(request: GetLinkToResetPasswordRequest): Promise<Void> | Observable<Void> | Void;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["register", "login", "validate", "updateTokens", "getLinkToResetPassword"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
