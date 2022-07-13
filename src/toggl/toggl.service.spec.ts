import { Test, TestingModule } from '@nestjs/testing';
import { TogglService } from './toggl.service';

describe('TogglService', () => {
  let service: TogglService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TogglService],
    }).compile();

    service = module.get<TogglService>(TogglService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
