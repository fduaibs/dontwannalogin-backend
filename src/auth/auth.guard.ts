import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../common/isPublic.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    const isAuthorized = this.verifyBasicToken(token);

    return isAuthorized;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Basic' ? token : undefined;
  }

  private verifyBasicToken(token: string): boolean {
    const [tokenUsername, tokenPassword] = token?.split(':') ?? [];

    const basicAuthUsername = this.configService.get('BASIC_AUTH_USER');
    const basicAuthPassword = this.configService.get('BASIC_AUTH_PASS');

    return tokenUsername === basicAuthUsername && tokenPassword === basicAuthPassword;
  }
}
