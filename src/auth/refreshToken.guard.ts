import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const token = request.headers.authorization?.split(' ')[1];
    const decoded = this.jwtService.decode(token);
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      if (this.authService.isTokenExpired(decoded)) {
        return this.authService.refreshAccessToken(decoded.id);
      }
      return false;
    }
  }
}
