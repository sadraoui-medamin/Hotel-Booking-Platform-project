import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@stayvista/shared-types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) =>
  Reflect.metadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required) return true;
    const { user } = ctx.switchToHttp().getRequest();
    if (!required.includes(user.role)) {
      throw new ForbiddenException(`Role ${user.role} cannot access this resource`);
    }
    return true;
  }
}