import { Test, TestingModule } from '@nestjs/testing';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';

describe('ScoringController', () => {
  let controller: ScoringController;
  let service: ScoringService;

  const mockScoringService = {
    getScoringResults: jest.fn(),
    runScoring: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoringController],
      providers: [
        {
          provide: ScoringService,
          useValue: mockScoringService,
        },
      ],
    }).compile();

    controller = module.get<ScoringController>(ScoringController);
    service = module.get<ScoringService>(ScoringService);
  });

  describe('getScoringResultsByScoringId', () => {
    it('should return an array of scoring results', async () => {
      const scoringID = '12345';
      const result = [];
      mockScoringService.getScoringResults.mockResolvedValue(result);

      const response = await controller.getScoringResultsByScoringId(scoringID);
      expect(response).toEqual(result);
    });
  });
});
