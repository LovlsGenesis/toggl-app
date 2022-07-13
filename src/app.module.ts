import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { AccountService } from './account/account.service';
import { TogglService } from './toggl/toggl.service';
import { TogglController } from './toggl/toggl.controller';
import { TogglModule } from './toggl/toggl.module';

@Module({
  imports: [ProfileModule, AccountModule, TogglModule],
  controllers: [AppController, ProfileController, AccountController, TogglController],
  providers: [AppService, ProfileService, AccountService, TogglService],
})
export class AppModule {}
