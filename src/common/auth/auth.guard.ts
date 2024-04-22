import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../is-public.decorator';
import { IS_ADM_KEY } from '../is-adm.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    const isAdm = this.reflector.getAllAndOverride<boolean>(IS_ADM_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const token = this.extractBasicTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    const isAuthorized = this.verifyBasicToken(token, isAdm);

    return isAuthorized;
  }

  private extractBasicTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Basic' ? token : undefined;
  }

  private verifyBasicToken(token: string, isAdmOnly?: boolean): boolean {
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');

    const [tokenUsername, tokenPassword] = decodedToken.split(':') ?? [];

    const basicAuthUsername = this.configService.get('BASIC_AUTH_USER');
    const basicAuthPassword = this.configService.get('BASIC_AUTH_PASS');
    const basicAuthAdmUsername = this.configService.get('BASIC_AUTH_ADM_USER');
    const basicAuthAdmPassword = this.configService.get('BASIC_AUTH_ADM_PASS');

    const isAdmAllowed = tokenUsername === basicAuthAdmUsername && tokenPassword === basicAuthAdmPassword;

    const isAllowed = tokenUsername === basicAuthUsername && tokenPassword === basicAuthPassword;

    return isAdmOnly ? isAdmAllowed : isAdmAllowed || isAllowed;
  }
}
