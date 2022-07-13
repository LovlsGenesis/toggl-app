import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { AccountService } from './account/account.service';
import { TogglService } from './toggl/toggl.service';
import { TogglController } from './toggl/toggl.controller';
import { TogglModule } from './toggl/toggl.module';

@Module({
  imports: [AccountModule, TogglModule],
  controllers: [AppController, AccountController, TogglController],
  providers: [AppService, AccountService, TogglService],
})
export class AppModule {}
