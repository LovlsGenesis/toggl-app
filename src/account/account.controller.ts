import { Param, Body, Controller, Post } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('token/:token')
  async addApiToken(
    @Param('token')
    token: string,
  ) {
    return this.accountService.addToken(token);
  }
}
