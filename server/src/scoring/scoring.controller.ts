import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { Scoring } from './models/scoring.model';
import { RunScoringDto } from './dto/scoring.dto';
import { ScoringResult } from '@prisma/client';

@Controller()
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Get('scoring/:id')
  async getScoringResultsByScoringId(
    @Param('id') id: string,
  ): Promise<Scoring[]> {
    return this.scoringService.getScoringResults(id);
  }

  @Post(':org/scoring')
  async runScoring(
    @Param('org') org: string,
    @Body() runScoring: RunScoringDto,
  ): Promise<ScoringResult> {
    const { ruleIDs, farmID } = runScoring;
    return await this.scoringService.runScoring(org, ruleIDs, farmID);
  }
}
