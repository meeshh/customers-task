import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql'; // Import ExecutionContext from '@nestjs/graphql' for GraphQL context
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    return requiredRoles.some((role) => user.role.includes(role));
  }
}
