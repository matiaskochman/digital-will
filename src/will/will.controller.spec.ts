import { Test, TestingModule } from '@nestjs/testing';
import { WillController } from './will.controller';

describe('WillController', () => {
  let controller: WillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WillController],
    }).compile();

    controller = module.get<WillController>(WillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
