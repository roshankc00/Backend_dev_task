// jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { USER_ROLE_ENUM } from 'src/common/enums/user.role.enum';

@Injectable()
export class JwtRoleAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE_ENUM[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && !requiredRoles?.some((role) => user?.role === role)) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return user;
  }
}
