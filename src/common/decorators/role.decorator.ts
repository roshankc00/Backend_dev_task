import { SetMetadata } from '@nestjs/common';
import { USER_ROLE_ENUM } from '../enums/user.role.enum';

export const Roles = (...roles: USER_ROLE_ENUM[]) =>
  SetMetadata('roles', roles);
