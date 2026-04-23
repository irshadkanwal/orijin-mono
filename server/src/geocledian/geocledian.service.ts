import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { GeocledianApiService } from './geocledianApi.service';
import {
  GeocledianCommodity,
  GeoCledianParcel,
  GeoCledianResponseProperties,
  GeoCledianRiskResponse,
  GeocledianStatus,
  GeoCledianSubmitResponseContent,
  GeoCledianSubmitResponseWrapper,
} from './geocledian.model';
import { Farm } from '../farms/models/farms.model';
import { SatelliteAnalysis } from '@prisma/client';
import { FarmsService } from '../farms/farms.service';
import { PlotsService } from '../farms/plots.service';

export interface ParcelAndPlot extends GeoCledianParcel {
  plotId: string;
}

@Injectable()
export class GeocledianService {
  logger = new Logger(GeocledianService.name);

  constructor(
    private prisma: PrismaService,
    private farmsService: FarmsService,
    private plotsService: PlotsService,
    private geocledianApiService: GeocledianApiService,
  ) {}

  /**
   * "A parcel is the plot / area of land which a commodity is sourced / produced from (as in the EUDR).
   * So it has to be 1 polygon. Technically it could be also a Multipolygon with several parts, but then
   * the parts have to be adjacent to each other - we don't support gaps between the parts."
   * - johannes.sommer@geocledian.com 29.4.2024
   *
   * Also see https://geocledian.com/agknow/api/v4/docs#/EUDR%20-%20Beta/register_eudr_parcel_agknow_api_v4_eudr_parcels_post
   *
   * @param farm
   */
  convertFarmToParcels(farm: Farm): ParcelAndPlot[] {
    if (!farm.plots || farm.plots.length === 0) {
      this.logger.warn('No plots for farm ' + farm.id);
      return null;
    }
    return farm.plots
      .map((plot) => {
        const coordinates = plot.polygons
          ? (plot.polygons.filter((poly) => poly.active)[0]
              .coordinates as number[])
          : undefined;
        if (!coordinates) {
          return null;
        }
        return {
          properties: {
            name: farm.facility.name, // name: name of parcel, used to filter the result. Can be full name or substring; optional; (255 chars)
            entity: farm.facility.name, // entity: farm name or other type of unit, used to filter the result; optional; (255 chars)
            foreign_id: plot.id, // foreign_id: identifier for parcel in foreign system; optional (255 chars)
            commodity: GeocledianCommodity.cocoa, // commodity: commodity type, valid options: cattle, cocoa, coffee, oilpalm, rubber, soya or wood
            production_start: '2020-01-01', // Constant for EUDR?
            production_end: '2024-07-31', // production_end: date of production / harvest in ANSI format: YYYY-MM-DD. EUDR risk analysis will be conducted with this date.
            country_iso: farm.facility.countryIso,
            process_timeseries: true,
            point_buffer_area: 1, // in hectares, only needed for single GPS point
          },
          // geometry has to be in WGS84 Projection (EPSG 4326) - in valid GeoJSON geometry.
          coordinates: coordinates ? [coordinates] : undefined,

          // "Bbox is optional. It's part of the GeoJSON standard and it does not harm when you
          // post it to out API but it will be calculated anyhow from our API in each response."
          // bbox: []..

          // transient
          plotId: plot.id,
        };
      })
      .filter((x) => x);
  }

  async upsertAnalysisResult(
    result: GeoCledianSubmitResponseContent | GeoCledianResponseProperties,
    plotId: string,
  ): Promise<SatelliteAnalysis> {
    this.logger.log(
      'Upserting ' +
        result['deforestation_risk'] +
        ' satellite for plotId ' +
        plotId +
        ' from GeoCledian, risk was: ' +
        result['deforestation_risk'],
    );

    const existing = await this.prisma.satelliteAnalysis.findMany({
      where: { plotId: plotId },
    });
    const data = {
      status: result['deforestation_risk']
        ? GeocledianStatus.ANALYZED
        : GeocledianStatus.PENDING,
      parcelId: '' + result.parcel_id,
      entity: result.entity,
      name: result.name,
      area: result.area,
      countryIso: result.country_iso,
      countryRisk: result['country_risk'],
      deforestationAreaHa: result['deforestation_area_ha'],
      deforestationRisk: result['deforestation_risk'],
      landcoverForestCoverage: result['landcover_forest_coverage'],
      landcoverNoTreesCoverage: result['landcover_no_trees_coverage'],
      landcoverPlantationCoverage: result['landcover_plantation_coverage'],
      landcoverShrubsCoverage: result['landcover_shrubs_coverage'],
      rawData: result,
    };

    if (existing.length === 0) {
      const allData = {
        data: {
          ...data,
          plot: { connect: { id: plotId } },
        },
      };
      return this.prisma.satelliteAnalysis.create(allData);
    } else {
      return this.prisma.satelliteAnalysis.update({
        where: { id: existing[0].id },
        data: data,
      });
    }
  }

  async submitAnalysisRequest(farmId: string, org: string): Promise<any> {
    const farm = await this.farmsService.getOne({ id: farmId, org });
    const parcels: ParcelAndPlot[] = this.convertFarmToParcels(farm);
    const promises = parcels.map(async (parcelAndPlot: ParcelAndPlot) => {
      const { plotId, ...parcel } = parcelAndPlot;
      const submitResult: GeoCledianSubmitResponseWrapper =
        await this.geocledianApiService.registerParcel(parcel);

      // Case A - Got ParcelID, store validation response
      // Coordinates get autofixed!
      // "On the parcel level only hard errors prevent the registration e.g. no geometry or mandatory
      // fields missing, wrong format. The validation report that you get from the parcel endpoint are
      // normally warnings and info messages. E.g. in your case there was a correction of the geometry
      // for parcel id 48503: "Warning: geometry was invalid - reason: 'Ring Self-intersection[30.0321605 0.6432342]'."
      // So the API could process the geometry but only after fixing the self intersection issue.
      // If a technical fix is not possible, the parcel would be rejected. In case of rejection you won't receive a parcel ID."
      if (submitResult.content?.parcel_id) {
        return this.upsertAnalysisResult(submitResult.content, plotId);
      }

      // Case B - did not get parcelID, failed
      // Store the results for each plot
      // const farm = await this.prisma.farm.findUnique({
      //   where: { id: farmId },
      //   include: this.defaultInclude,
      // });
      //
      this.logger.error(JSON.stringify(submitResult, null, 4));
      throw new Error('Failed to register parcel for plot ' + plotId);
    });
    return await Promise.all(promises);
  }

  async getAndStoreAnalysisResponse(
    plotId: string,
    org,
  ): Promise<SatelliteAnalysis> {
    const plot = await this.plotsService.getOne(plotId);

    // Furthermore the relative area of landcover detected on the registered polygon (landcover) is part of the response.
    // The potential deforestation risk (deforestation_risk) will be classified as low, medium or high depending on the landcover results.
    // Additionally the likelihood of a deforestation on the polygon area is provided as an index (deforestation_index) between 0 (no deforestation) and 100 (completely deforestated).
    // For visualisation purposes links to the satellite data used are provided on the polygon level comprising the True Color Image (RGB) of the latest satellite image date available (rgb_png_sdate) and
    // the closest satellite image available for the baseline date of 2020-12-31 (rgb_png_baseline_date). If the deforestation risk was classified as medium or high a link to the change detection analysis
    // is provided (change_png).
    // The EUDR states that all countries will be assigned to a specific risk level (country_risk).
    // Currently all countries have been assigned to a standard risk level until the EU publishes a detailed list with a dedicated risk level for each country.
    // The internal algorithm used is stored in a version tag (model_version), while the date of the EUDR Check generation result is also available (generation_date).
    const existingAnalysis = plot.satelliteAnalysis[0];
    const parcelId = existingAnalysis?.parcelId;
    if (!parcelId) {
      this.logger.warn(
        'No satellite analysis requested for plot ' +
          plot.shortCode +
          ' / ' +
          plot.id,
      );
      return null;
    }
    // console.log(plot.satelliteAnalysis);
    if (existingAnalysis.status !== 'PENDING') {
      this.logger.log(
        'Analysis already done for plot ' +
          plot.shortCode +
          ', risk was: ' +
          existingAnalysis.deforestationRisk,
      );
      return existingAnalysis;
    }
    const satelliteAnalysis: GeoCledianRiskResponse =
      await this.geocledianApiService.getParcelRisk(parcelId);
    return this.upsertAnalysisResult(satelliteAnalysis.properties, plot.id);
  }
}
