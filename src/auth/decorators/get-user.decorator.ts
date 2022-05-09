import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const GetUser = createParamDecorator(async function GetUser(
  _data,
  context: ExecutionContext,
): Promise<User> {
  const req = await context.switchToHttp().getRequest();
  return req.user;
});