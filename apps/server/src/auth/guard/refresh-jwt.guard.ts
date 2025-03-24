import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../auth.service';

// Extend the Express Request type to include cookies
declare module 'express' {
  interface Request {
    cookies: {
      [key: string]: string | undefined;
    };
  }
}

@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const refreshToken = request.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.authService.validateToken(refreshToken);
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
