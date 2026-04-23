import { HttpServer, INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { FarmsModule } from '../src/farms/farms.module';
import { FarmsService } from '../src/farms/farms.service';
import { GeocledianModule } from '../src/geocledian/geocledian.module';
import { GeocledianService } from '../src/geocledian/geocledian.service';
import { GeocledianApiService } from '../src/geocledian/geocledianApi.service';
import { createTestingModuleWithPrisma } from './test-util';
import { getExampleFarmInputs } from '../src/common/seed/seedData/exampleFarms';

describe('Geocledian Service (E2E)', () => {
  let app: INestApplication;
  let server: HttpServer;
  let geocledianService: GeocledianService;
  let geocledianApiService: GeocledianApiService;
  let farmsService: FarmsService;

  const organisation = 'test';
  const exampleFarmInput = getExampleFarmInputs(organisation);

  const geoCledianSubmitSample = {
    content: {
      parcel_id: 51441,
      commodity: 'cocoa',
      name: 'Sarah Maglass',
      foreign_id: 'clzxo8dmd0007wtmhohwjwhyb',
      entity: 'Sarah Maglass',
      production_start: '2020-12-31',
      production_end: '2024-07-31',
      country_iso: 'UGA',
      area_rep: null,
      point_buffer_area: null,
      process_timeseries: true,
      area: 0.3679,
      centroid: {
        type: 'Point',
        coordinates: [30.1701571, 0.8488141],
      },
      bounding_box: [
        [-8.126959, 36.293371],
        [-8.125192, 36.295803],
      ],
      geohash: 'ey6nrp4',
      validation: {
        foreign_id: 'clzxo8dmd0007wtmhohwjwhyb',
        parcel_id: 51441,
        geometry: {
          valid: null,
          messages: null,
        },
        attr_schema: {
          valid: null,
          message: null,
        },
        attributes: [],
        generation_date: new Date('2024-08-17T11:47:00'),
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [30.1701571, 0.8488141],
              [30.1705245, 0.8487271],
              [30.1704467, 0.8488129],
              [30.1702282, 0.8487563],
              [30.1700357, 0.8486596],
            ],
          ],
        ],
        bbox: null,
      },
    },
  };

  const geoCledianRiskResponseSample = {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [30.1701571, 0.8488141],
          [30.1705245, 0.8487271],
          [30.1704467, 0.8488129],
          [30.1702282, 0.8487563],
          [30.1700357, 0.8486596],
        ],
      ],
      bbox: null,
    },
    properties: {
      parcel_id: 51441,
      name: '2022_14_536c4c3',
      entity: '2022_14_536c4c3',
      commodity: 'cocoa',
      production_start: '2020-12-31',
      production_end: '2024-05-01',
      country_iso: 'UGA',
      area_rep: null,
      area: 0.3679,
      geohash: 'ey6nhvg',
      point_buffer_area: 4,
      validation: null,
      deforestation_risk: 'low',
      deforestation_index: 0,
      deforestation_area_ha: 0,
      degradation_risk: null,
      degradation_area_ha: null,
      degradation_index: null,
      baseline_date: '2020-12-31',
      sdate: '2024-05-02',
      landcover_forest_coverage: 0.08,
      landcover_plantation_coverage: 0,
      landcover_shrubs_coverage: 0,
      landcover_no_trees_coverage: 0.92,
      landcover_png_baseline_date:
        'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48538/risk/1/landcover_mask.png?key=123',
      rgb_png_baseline_date:
        'https://global.geocledian.com/agknow/api/v4/parcels/48538/visible/sentinel2/3406560.png?key=123',
      rgb_png_production_enddate:
        'https://global.geocledian.com/agknow/api/v4/parcels/48538/visible/sentinel2/3406409.png?key=123',
      forest_change_png: null,
      country_risk: 'standard',
      model_version: '1.0.9',
      generation_date: '2024-05-12T20:00:00',
      map_utils_landcover_legend_png:
        'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48538/risk/1/landcover_mask.png?key=123&legend=true',
      map_utils_forest_change_legend_png: null,
      map_utils_scalebar:
        'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48538/risk/1/landcover_mask.png?key=123&scale=true',
    },
    id: 123,
    bbox: [-8.224472289716461, 36.242815, -8.22393500000001, 36.24362093457468],
  };

  const geocledianApiServiceMock = {
    registerParcel: jest.fn((args) => {
      return geoCledianSubmitSample;
    }),
    getParcelRisk: jest.fn((args) => {
      return geoCledianRiskResponseSample;
    }),
  };

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma(
      {
        imports: [FarmsModule, GeocledianModule],
      },
      (testBuilder: TestingModuleBuilder) =>
        testBuilder
          .overrideProvider(GeocledianApiService)
          .useValue(geocledianApiServiceMock),
    );
    app = initialized.app;
    server = app.getHttpServer();
    geocledianService =
      initialized.moduleFixture.get<GeocledianService>(GeocledianService);
    geocledianApiService =
      initialized.moduleFixture.get<GeocledianApiService>(GeocledianApiService);
    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);
  });

  describe('GeoCledian Service (only DB, no API)', () => {
    it('Submit a Parcel request', async () => {
      const farm = await farmsService.create({
        organisation: organisation,
        facilityValues: exampleFarmInput[0].facilityValues,
        farmValues: exampleFarmInput[0].farmValues,
      });
      const pendingAnalysisResponse =
        await geocledianService.submitAnalysisRequest(farm.id, organisation);

      expect(geocledianApiService.registerParcel).toHaveBeenCalledWith(
        expect.objectContaining({
          coordinates: expect.anything(), // TODO: Bring back after concace fix [exampleFarmInput[0].autofixedCoordinates],
          properties: {
            commodity: 'cocoa',
            name: exampleFarmInput[0].facilityValues.name,
            entity: exampleFarmInput[0].facilityValues.name,
            foreign_id: expect.anything(),
            production_start: '2020-01-01',
            production_end: '2024-07-31',
            country_iso: 'UGA',
            process_timeseries: true,
            point_buffer_area: 1,
          },
        }),
      );

      // NOTE: In the actual Prisma fields the Prisma.decimal must be used, but in the raw JSON it's just that - raw json..
      expect(pendingAnalysisResponse[0]).toEqual(
        expect.objectContaining({
          parcelId: '51441',
          status: 'PENDING',
          area: new Prisma.Decimal('0.3679'),
          countryIso: 'UGA',
          countryRisk: null,
          deforestationAreaHa: null,
          deforestationRisk: null,
          deletedAt: null,
          entity: 'Sarah Maglass',
          landcoverForestCoverage: null,
          landcoverNoTreesCoverage: null,
          landcoverPlantationCoverage: null,
          landcoverShrubsCoverage: null,
          name: 'Sarah Maglass',
        }),
      );
    });

    it('Get a risk response for Parcel', async () => {
      const farm = await farmsService.create({
        organisation: organisation,
        facilityValues: exampleFarmInput[0].facilityValues,
        farmValues: exampleFarmInput[0].farmValues,
      });
      await geocledianService.submitAnalysisRequest(farm.id, organisation);

      const result = await geocledianService.getAndStoreAnalysisResponse(
        farm.plots[0].id,
        organisation,
      );
      expect(result).toEqual(
        expect.objectContaining({
          parcelId: '51441',
          status: 'ANALYZED',
          area: new Prisma.Decimal(0.3679),
          countryIso: 'UGA',
          countryRisk: 'standard',
          deforestationAreaHa: new Prisma.Decimal(0),
          deforestationRisk: 'low',
          landcoverForestCoverage: new Prisma.Decimal(0.08),
          landcoverNoTreesCoverage: new Prisma.Decimal(0.92),
          landcoverPlantationCoverage: new Prisma.Decimal(0),
          landcoverShrubsCoverage: new Prisma.Decimal(0),
        }),
      );
    });
  });
});
