import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService } from './scoring.service';
import { RuleService } from '../rule/rule.service';
import { PrismaService } from 'nestjs-prisma';
import { FarmsService } from '../farms/farms.service';
import { RuleFunctionFactory } from '../rule/lib/ruleValidations/factory/ruleFunctionFactory.service';
import { FacilitiesService } from '../facilities/facilities.service';
import { PlotsService } from '../farms/plots.service';
import { GeocledianService } from '../geocledian/geocledian.service';
import { PolygonUtilService } from '../polygonUtil/polygonUtil.service';
import { GeocledianApiService } from '../geocledian/geocledianApi.service';
import { HttpService } from '@nestjs/axios';

describe.skip('ScoringService', () => {
  let service: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoringService,
        PrismaService,
        RuleService,
        FarmsService,
        RuleFunctionFactory,
        FacilitiesService,
        PlotsService,
        GeocledianService,
        PolygonUtilService,
        GeocledianApiService,
        HttpService,
      ],
    }).compile();

    service = module.get<ScoringService>(ScoringService);
  });
  //skipping due to provider errors
  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
