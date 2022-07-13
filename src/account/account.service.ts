import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
  addToken(token: string): any {
    if (!token) throw new ForbiddenException('Token is invalid');

    global.token = token;
    return { message: 'Token successfully added' };
  }
}
