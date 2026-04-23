import { INestApplication } from '@nestjs/common';
import { createTestingModuleWithPrisma } from './test-util';
import { GeocledianModule } from '../src/geocledian/geocledian.module';
import { GeocledianApiService } from '../src/geocledian/geocledianApi.service';
import { GeocledianCommodity } from '../src/geocledian/geocledian.model';
import { FarmsModule } from '../src/farms/farms.module';

/**
 * Not a real automatic test, more a one-off library to manually test the Geocledian API
 *
 * Keep as ".skip" in Git.
 *
 * Additionally guarded against via .env.tests setting the API key to null
 */
describe.skip('LIVE Geocledian API Service (E2E)', () => {
  let app: INestApplication;
  let geocledianApiService: GeocledianApiService;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [FarmsModule, GeocledianModule],
    });
    app = initialized.app;
    geocledianApiService =
      initialized.moduleFixture.get<GeocledianApiService>(GeocledianApiService);

    if (!process.env.GEOCLEDIAN_KEY || process.env.GEOCLEDIAN_KEY === '') {
      expect('No key found').toEqual('So stopping on purpose');
    }
  });

  const uganda = 'UGA';

  // FIRST - Some actual polygons
  const ltcUgandaParcel = [
    {
      // Good
      properties: {
        commodity: GeocledianCommodity.cocoa,
        name: 'Orijin Test One',
        foreign_id: 'BRA_284663_001',
        entity: 'Orijin test farm 1',
        // area_rep: 12.4873, // 0.07856343604208496
        production_start: '2020-01-01',
        production_end: '2024-07-31',
        country_iso: uganda,
        process_timeseries: true,
        point_buffer_area: 4,
        // area: 10.2,
        // area_ratio: 0.818,
      },
      coordinates: [
        [
          [30.0320359, 0.6433227],
          [30.0321605, 0.6432342],
          [30.0321559, 0.642957],
          [30.031701, 0.6431071],
          // [30.0321605, 0.6432342], // Self-intersects
          [30.0320359, 0.6433227],
        ],
      ],
    },
  ];

  // SECOND - Random box that is bit larger
  const randomBoxTest = {
    properties: {
      commodity: GeocledianCommodity.cocoa,
      name: 'Orijin Test Two',
      foreign_id: 'BRA_284663_001',
      entity: 'Orijin test farm 2',
      production_start: '2020-01-01',
      production_end: '2024-04-30',
      country_iso: uganda,
      process_timeseries: true,
      point_buffer_area: 4,
    },
    coordinates: [
      [
        [33.4958436186148, 0.3789556940700294],
        [33.4958436186148, 0.3759467226322357],
        [33.49886733357488, 0.3759467226322357],
        [33.49886733357488, 0.3789556940700294],
        [33.4958436186148, 0.3789556940700294],
      ],
    ],
  };
  // THIRD - individual GPS coords -> needs converting from polygon to point?
  // -8.206945, 36.249878	zamda.gumbo@kokoakamili.com
  // -8.204058, 36.248944	salma.lumbanga@kokoakamili.com
  // const
  const kokoaKamiliSinglePoint = {
    properties: {
      commodity: GeocledianCommodity.cocoa,
      name: 'Orijin Test Three with single point',
      foreign_id: 'BRA_284663_001',
      entity: 'Orijin Test Farm 3',
      production_start: '2020-01-01',
      production_end: '2024-07-31',
      country_iso: 'TZA',
      process_timeseries: true,
      point_buffer_area: 1,
    },
    coordinates: [36.249878, -8.206945],
  };
  const ltcUgandaParcelSelfOverlap = [
    {
      properties: {
        commodity: GeocledianCommodity.cocoa,
        name: 'Orijin Test TXXwo',
        foreign_id: 'BRA_284663_001',
        entity: 'Orijin Test Farm 2',
        area_rep: 12.4873,
        production_start: '2020-01-01',
        production_end: '2024-07-31',
        country_iso: uganda,
        process_timeseries: true,
        point_buffer_area: 4,
        area: 10.2,
        area_ratio: 0.818,
      },
      coordinates: [
        // selfoverlap
        [
          [30.1701571, 0.8488141],
          [30.1705245, 0.8487271],
          [30.1704467, 0.8488129],
          [30.1702282, 0.8487563],
          [30.1700357, 0.8486596],
          [30.170148, 0.8485756],
          [30.1703817, 0.8485462],
          [30.1705245, 0.8487271],
          [30.1701571, 0.8488141],
        ],
      ],
    },
  ];

  // const kokoaKamili = {
  //   good: [
  //     // KK Tanzania
  //     // KK - Good basic polygon
  //     [36.25157, -8.200072],
  //     [36.251497, -8.199855],
  //     [36.251232, -8.199875],
  //     [36.251088, -8.199973],
  //     [36.25157, -8.200072],
  //   ],
  //   oneSpike: [
  //     [36.250712, -8.201746], // 	zamda.gumbo@kokoakamili.com	07/11/2022 12:53:12
  //     [36.250226, -8.206954], // 	zamda.gumbo@kokoakamili.com	07/11/2022 12:55:27
  //     [36.249878, -8.206945], // 	zamda.gumbo@kokoakamili.com	07/11/2022 12:54:43
  //     [36.250095, -8.206536], // 	zamda.gumbo@kokoakamili.com	07/11/2022 12:56:59
  //     [36.250712, -8.201746],
  //   ],
  // };

  beforeEach(() => {
    console.log(process.env.GEOCLEDIAN_KEY);
  });

  it.only('Get usage', async () => {
    const usage = await geocledianApiService.usageSummary();
    expect(usage).toEqual({});
  });

  it('Register parcels', async () => {
    const parcels = await geocledianApiService.registerParcel(
      kokoaKamiliSinglePoint,
    );
    expect(parcels).toEqual({});
  });

  it('Get all parcels', async () => {
    const parcels = await geocledianApiService.getParcels();
    expect(parcels).toEqual({});
  });

  it('Get single parcel', async () => {
    // 48503, = failed
    // 48504 = failed
    // 48505 = ok
    // 48506 = ok
    const parcels = await geocledianApiService.getParcel('48506');
    expect(parcels).toEqual({});
  });

  it('Get single parcel risk', async () => {
    // 48503, = failed
    // 48504 = failed
    // 48505 = ok
    // 48506 = ok
    // 48510 = random box test - response 2024-05-06T02:37:00 ?
    // 48511 = random box test uudestaan vahingossa
    // 48512 = single point, 4 multiplier - response 2024-05-06T02:38:00"
    // 48513 = single point, 1 multiplier
    const riskResult = await geocledianApiService.getParcelRisk('48512');
    console.log(JSON.stringify(riskResult, null, 4));
    expect(riskResult).toEqual(
      expect.objectContaining({
        type: 'Feature',
        bbox: expect.anything(),
        geometry: expect.anything(),
        id: expect.anything(),
        properties: expect.anything(),
      }),
    );
  });
});
