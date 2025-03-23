import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { UserInfo } from 'src/types/request';

export const getCurrentUser = createParamDecorator(
  (data: keyof UserInfo | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    if (!data) return request.user;
    return request.user[data];
  },
);
