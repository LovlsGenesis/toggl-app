import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { selectDaysEntryDTO, timeEntriesDTO } from './toggl.controller';
import api from 'src/api/api';

export interface IDate {
  label: string;
  begin: Date;
  end: Date;
}

export interface IProject {
  name: string;
  id: number;
  wid: number;
}

@Injectable()
export class TogglService {
  async workspaces(): Promise<void> {
    if (!global.token) {
      throw new ForbiddenException('Please set your API Token');
    }

    const token = Buffer.from(`${global.token}:api_token`).toString('base64');
    const { data } = await api.get(`/v9/workspaces`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    return data.map((workspace) => ({
      name: workspace.name,
      id: workspace.id,
    }));
  }

  async projects(wid): Promise<IProject[]> {
    if (!wid) {
      throw new ForbiddenException('Param WID is required');
    }

    const token = Buffer.from(`${global.token}:api_token`).toString('base64');
    const { data } = await api.get(`/v9/workspaces/${wid}/projects`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    return data.map((project) => ({
      name: project.name,
      id: project.id,
      wid: project.wid,
    }));
  }

  selectDays({ beginDate, endDate, beginHour, endHour }: selectDaysEntryDTO) {
    if (!beginDate || !endDate) {
      throw new NotFoundException('BeginDate || EndDate missing');
    }
    const [beginYear, beginMonth, beginDay] = beginDate.split('-');
    const [endYear, endMonth, endDay] = endDate.split('-');
    const dateArray = [];
    for (let month = +beginMonth; month <= +endMonth; month++) {
      for (let day = +beginDay; day <= +endDay; day++) {
        const createdDate = new Date(+beginYear, month - 1, day);
        const createdDateDay = createdDate.getDay();
        if (createdDateDay != 6 && createdDateDay != 0) {
          dateArray.push(createdDate);
        }
      }
    }
    return this.setTimeEntries(beginHour, endHour, dateArray);
  }

  setTimeEntries(beginHour, endHour, dates): IDate[] {
    if (!beginHour || !endHour) {
      throw new NotFoundException('BeginHour || EndHour missing');
    }
    const start = beginHour.split(':')[0];
    const end = endHour.split(':')[0];

    if (dates.length == 0) {
      throw new NotFoundException('Dates params is empty');
    }

    const timeEntries: IDate[] = [];
    dates.forEach((date) => {
      const dateValue = new Date(date);
      const beginDate = new Date(dateValue.setHours(start, 0));
      const endDate = new Date(dateValue.setHours(end, 0));
      const newDate = {
        label: dateValue.toLocaleDateString('pt-BR'),
        begin: beginDate,
        end: endDate,
      };
      timeEntries.push(newDate);
    });
    return timeEntries;
  }

  async timeEntries({
    timeEntries,
    wid,
    projectId,
    description,
  }: timeEntriesDTO): Promise<any[]> {
    if (!timeEntries || timeEntries.length == 0) {
      throw new ForbiddenException("TimeEntries can't be empty");
    }
    const apiResponses = [];
    const token = Buffer.from(`${global.token}:api_token`).toString('base64');
    let index = 0;
    const interval = setInterval(async () => {
      console.log(index === timeEntries.length);
      if (index === timeEntries.length) {
        clearInterval(interval);
        console.log('FINISHED');
        return;
      }
      const timeEntry = timeEntries[index];
      const duration =
        (new Date(timeEntry.end).getHours() -
          new Date(timeEntry.begin).getHours()) *
        60 *
        60;

      try {
        const { data } = await api.post(
          `/v9/workspaces/${wid}/time_entries`,
          {
            created_with: 'Snowball',
            start: timeEntry.begin,
            stop: timeEntry.end,
            wid: wid,
            project_id: projectId,
            description: description,
            duration: duration,
          },
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          },
        );
        apiResponses.push(data);
      } catch (error) {
        clearInterval(interval);
        console.log(error.response.data);
        throw new ForbiddenException(
          `${error.message} - ${error.response.data}`,
        );
      }
      index++;
    }, 5000);
    return apiResponses;
  }
}
