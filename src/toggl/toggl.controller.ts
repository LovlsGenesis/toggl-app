import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TogglService, IDate } from './toggl.service';

export interface selectDaysEntryDTO {
  beginning: string;
  end: string;
  dates?: string[];
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

  @Get('projects')
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

  @Get('time-entries')
  async setTimeEntries(
    @Body()
    selectDaysEntryDTO: selectDaysEntryDTO,
  ): Promise<IDate[]> {
    return this.togglService.setTimeEntries(selectDaysEntryDTO);
  }

  @Post('time-entries')
  async timeEntries(
    @Body()
    timeEntriesDTO: timeEntriesDTO,
  ) {
    return await this.togglService.timeEntries(timeEntriesDTO);
  }
}
