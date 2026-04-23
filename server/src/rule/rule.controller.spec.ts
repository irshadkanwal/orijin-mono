import { Test, TestingModule } from '@nestjs/testing';
import { RuleService } from './rule.service';
import { Rule } from './models/rule.model';
import { RuleController } from './rule.constroller';

describe('RuleController', () => {
  let controller: RuleController;
  let service: RuleService;

  const mockRules: Rule[] = [];

  const mockRuleService = {
    getAllRules: jest.fn().mockResolvedValue(mockRules),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuleController],
      providers: [
        {
          provide: RuleService,
          useValue: mockRuleService,
        },
      ],
    }).compile();

    controller = module.get<RuleController>(RuleController);
    service = module.get<RuleService>(RuleService);
  });

  describe('getRules', () => {
    it('should return an array of rules', async () => {
      const result = await controller.getRules();
      expect(result).toEqual(mockRules);
      expect(service.getAllRules).toHaveBeenCalled();
    });
  });
});
