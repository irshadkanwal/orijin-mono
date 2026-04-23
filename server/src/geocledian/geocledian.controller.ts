import { Controller, Get, Param, Post } from '@nestjs/common';
import { SatelliteAnalysis } from '@prisma/client';
import { GeocledianService } from './geocledian.service';

@Controller()
export class GeocledianController {
  constructor(private readonly geoCledainService: GeocledianService) {}

  // TODO: Convert to Post, perhaps, later..
  @Get(':org/startAnalysis/farm/:id')
  startSatelliteAnalysisForFarm(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<SatelliteAnalysis> {
    // TODO: Confirm that the org is the same as the parent farm
    return this.geoCledainService.submitAnalysisRequest(id, org);
  }

  @Get(':org/analysisResult/plot/:id')
  getRiskAnalysisResultForPlot(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<SatelliteAnalysis> {
    // TODO: Confirm that the org is the same as the parent farm
    return this.geoCledainService.getAndStoreAnalysisResponse(id, org);
  }
}
