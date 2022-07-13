import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  public profile(): string {
    return global.token;
  }
}
