import { Test, TestingModule } from '@nestjs/testing';
import { JustifyTextService } from './justify-text.service';

describe('JustifyTextService', () => {
  let service: JustifyTextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JustifyTextService],
    }).compile();

    service = module.get<JustifyTextService>(JustifyTextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
