import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

const getCuurentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const Currentuser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCuurentUserByContext(context),
);
