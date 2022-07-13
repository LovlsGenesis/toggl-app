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

  selectDays({ beginning, end }: selectDaysEntryDTO) {
    if (!beginning || !end) {
      throw new NotFoundException('Beginning || End missing');
    }
    const [beginDay, beginMonth, beginYear] = beginning.split('/');
    const [endDay, endMonth, endYear] = end.split('/');
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
    return { dates: dateArray };
  }

  setTimeEntries({ beginning, end, dates }: selectDaysEntryDTO): IDate[] {
    if (!beginning || !end) {
      throw new NotFoundException('Beginning || End missing');
    }

    const startHour = +beginning;
    const endHour = +end;

    if (dates.length == 0) {
      throw new NotFoundException('Dates params is empty');
    }

    const timeEntries: IDate[] = [];
    dates.forEach((date) => {
      const dateValue = new Date(date);
      const begin = new Date(dateValue.setHours(startHour, 0, 0));
      const end = new Date(dateValue.setHours(endHour, 0, 0));
      const newDate = {
        label: dateValue.toLocaleDateString('pt-BR'),
        begin,
        end,
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
    timeEntries.forEach(async (timeEntry) => {
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
        setTimeout(() => {
          console.log('Waiting 5s');
        }, 5000);
      } catch (error) {
        throw new ForbiddenException(error.message);
      }
    });
    return apiResponses;
  }
}
