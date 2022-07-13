import { Test, TestingModule } from '@nestjs/testing';
import { TogglController } from './toggl.controller';

describe('TogglController', () => {
  let controller: TogglController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TogglController],
    }).compile();

    controller = module.get<TogglController>(TogglController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
