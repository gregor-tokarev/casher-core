import { Test, TestingModule } from '@nestjs/testing';
import { AdminProductService } from './product.service';

describe('ProductService', () => {
  let service: AdminProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminProductService],
    }).compile();

    service = module.get<AdminProductService>(AdminProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
