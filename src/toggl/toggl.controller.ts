import { Body, Controller, Get, Post } from '@nestjs/common';
import { TogglService, IDate } from './toggl.service';

export interface selectDaysEntryDTO {
  beginDate: string;
  endDate: string;
  beginHour: string;
  endHour: string;
}

export interface timeEntriesDTO {
  timeEntries: IDate[];
  wid: number;
  projectId?: number;
  description?: string;
}

@Controller('toggl')
export class TogglController {
  constructor(private readonly togglService: TogglService) {}

  @Get('workspaces')
  async workspaces() {
    return this.togglService.workspaces();
  }

  @Post('projects')
  async projects(
    @Body('wid')
    wid: number,
  ) {
    return this.togglService.projects(wid);
  }

  @Post('days')
  async setDays(
    @Body()
    selectDaysEntryDTO: selectDaysEntryDTO,
  ) {
    return this.togglService.selectDays(selectDaysEntryDTO);
  }

  @Post('time-entries')
  async timeEntries(
    @Body()
    timeEntriesDTO: timeEntriesDTO,
  ) {
    return await this.togglService.timeEntries(timeEntriesDTO);
  }
}
