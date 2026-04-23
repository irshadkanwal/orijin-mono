import { ConsoleLogger, INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PolygonUtilService } from './polygonUtil.service';
import { geoCledianCircle } from './sampledata/geoCledianCircle';
import { PlotCoordinateSources } from '../farms/models/plots.model';

/**
 * For dropping to https://geojson.io/ or similar
 */
const createVisualComparison = (
  originalCoordinates: number[][],
  fixedCoordinates: number[][],
  polygonUtilService: PolygonUtilService,
) => {
  const geoJson = polygonUtilService.convertToGeoJson([
    { coordinates: originalCoordinates, properties: { original: true } },
    {
      coordinates: polygonUtilService.shiftPolygon(fixedCoordinates),
      properties: { fixed: true },
    },
  ]);
  return JSON.stringify(geoJson);
};

describe('PolygonUtilService', () => {
  let polygonUtilService: PolygonUtilService;
  let app: INestApplication;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [PolygonUtilService, Logger],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useLogger(new Logger());
    await app.init();
    logger = app.get<Logger>(Logger);
    polygonUtilService = app.get<PolygonUtilService>(PolygonUtilService);
  });

  describe('Polygon tests', () => {
    it('Calculate area', async () => {
      const result = await polygonUtilService.calculateArea(geoCledianCircle);
      expect(result).toEqual(38357.5130025623);
    });

    it('Detect self-intersection', async () => {
      const result = polygonUtilService.selfIntersects([
        [30.1701571, 0.8488141],
        [30.1705245, 0.8487271],
        [30.1704467, 0.8488129],
        [30.1702282, 0.8487563],
        [30.1700357, 0.8486596],
        [30.1701571, 0.8488141],
      ]);
      expect(result).toEqual(true);
    });

    it('Not detect self-intersection when polygon OK', async () => {
      const result = polygonUtilService.selfIntersects([
        [32.44980716313785, 1.395156676467579],
        [32.443494691071805, 1.3868533259032034],
        [32.46767631196789, 1.365934927406471],
        [32.44980716313785, 1.395156676467579],
      ]);
      expect(result).toEqual(false);
    });

    it('Get warning about a self-intersection', async () => {
      const result = polygonUtilService.completePolygonAndGetWarnings(
        [
          [32.60071378490565, 0.44634652547057385],
          [32.6007339691229, 0.44629732793529797],
          [32.60078064512368, 0.44630489678638696],
          [32.60079704480023, 0.4463427410446883],
          [32.60076550696073, 0.44636292464946337],
          [32.60076172242003, 0.4462670525287393],
          [32.6007453227451, 0.44635409432234496],
          [32.60071378490565, 0.44634652547057385],
        ],
        PlotCoordinateSources.IMPORT,
      );
      expect(result.polygonWarnings).toMatchObject([
        { key: 'Self-intersects', fixed: false },
      ]);
    });

    it('Not get warnings', async () => {
      const result = polygonUtilService.completePolygonAndGetWarnings(
        [
          [32.60088854987626, 0.44635039280630906],
          [32.60089448242448, 0.446322708422457],
          [32.60092348599326, 0.4463273224865958],
          [32.6009208493052, 0.4463563251744631],
          [32.60088854987626, 0.44635039280630906],
        ],
        PlotCoordinateSources.IMPORT,
      );
      expect(result.polygonWarnings).toMatchObject([]);
    });

    it('Fix a self-intersection', async () => {
      const key = 'Fix a self-intersection';
      const originalCoordinates = [
        [32.60071378490565, 0.44634652547057385],
        [32.6007339691229, 0.44629732793529797],
        [32.60078064512368, 0.44630489678638696],
        [32.60079704480023, 0.4463427410446883],
        [32.60076550696073, 0.44636292464946337],
        [32.60076172242003, 0.4462670525287393],
        [32.6007453227451, 0.44635409432234496],
        [32.60071378490565, 0.44634652547057385],
      ];
      const result = polygonUtilService.fixPolygon(
        originalCoordinates,
        [{ key: 'Self-intersects', fixed: false }],
        PlotCoordinateSources.IMPORT,
        key,
      );
      const fixedCoordinates = [
        [32.60076550696073, 0.44636292464946337],
        [32.60079704480023, 0.4463427410446883],
        [32.60078064512368, 0.44630489678638696],
        [32.60076172242003, 0.4462670525287393],
        [32.6007339691229, 0.44629732793529797],
        [32.60071378490565, 0.44634652547057385],
        [32.60076550696073, 0.44636292464946337],
        // With pre-concave fix
        // [32.60071378490565, 0.44634652547057385],
        // [32.60079704480023, 0.4463427410446883],
        // [32.60076172242003, 0.4462670525287393],
        // [32.60071378490565, 0.44634652547057385],
      ];
      expect(result).toMatchObject({
        fixedCoordinates: fixedCoordinates,
        warningsAfterFixAttempt: [{ key: 'Self-intersects', fixed: true }],
      });
      logger.debug(
        createVisualComparison(
          originalCoordinates,
          fixedCoordinates,
          polygonUtilService,
        ),
        `Visual comparison of test "${key}"`,
      );
    });

    it('Not fix a self-intersection', async () => {
      const coordinates = [
        [32.60088854987626, 0.44635039280630906],
        [32.60089448242448, 0.446322708422457],
        [32.60092348599326, 0.4463273224865958],
        [32.6009208493052, 0.4463563251744631],
        [32.60088854987626, 0.44635039280630906],
      ];

      const result = polygonUtilService.fixPolygon(
        coordinates,
        [],
        PlotCoordinateSources.IMPORT,
        'Not fix a self-intersection',
      );
      expect(result).toMatchObject({
        fixedCoordinates: coordinates,
        warningsAfterFixAttempt: [],
      });
    });
  });

  describe('Real-life cases', () => {
    it('BBD-1152 - long spike at start', async () => {
      const key = 'BBD-1152';
      const originalCoordinates = [
        [30.0630932, 0.6999388],
        [30.0651114, 0.6935796],
        [30.0652134, 0.6939518],
        [30.0652249, 0.6939695],
        [30.0652834, 0.6939793],
        [30.0653296, 0.6939488],
        [30.0653499, 0.6938887],
        [30.0653539, 0.6938354],
        [30.0653163, 0.6937667],
        [30.0652521, 0.6937194],
        [30.0651917, 0.6937905],
        [30.0651582, 0.6938389],
        [30.0651485, 0.6939026],
        [30.065159, 0.6939499],
        [30.0651857, 0.6939613],
      ];
      const warnings = polygonUtilService.completePolygonAndGetWarnings(
        originalCoordinates,
        PlotCoordinateSources.ORIJIN_APP,
      );
      expect(warnings.polygonWarnings).toMatchObject([
        {
          fixed: false,
          key: 'Spikes',
        },
        {
          fixed: false,
          key: 'Self-intersects',
        },
      ]);
      const result = polygonUtilService.fixPolygon(
        originalCoordinates,
        warnings.polygonWarnings,
        PlotCoordinateSources.ORIJIN_APP,
        key,
      );
      const expectedFixedCoordinates = [
        // [30.0630932, 0.6999388], // Distance 706.23103930208 between [30.0652134,0.6939518]and [30.0630932,0.6999388]
        // [30.0651114, 0.6935796], // Distance  42.91255926593 between [30.0652134,0.6939518]and [30.0651114,0.6935796]
        [30.0652134, 0.6939518],
        [30.0652249, 0.6939695],
        [30.0652834, 0.6939793],
        [30.0653296, 0.6939488],
        [30.0653499, 0.6938887],
        [30.0653539, 0.6938354],
        [30.0653163, 0.6937667],
        [30.0652521, 0.6937194],
        [30.0651917, 0.6937905],
        [30.0651582, 0.6938389],
        [30.0651485, 0.6939026],
        [30.065159, 0.6939499],
        [30.0651857, 0.6939613],
        [30.0652134, 0.6939518], // Appended till the end
      ];
      logger.debug(
        createVisualComparison(
          originalCoordinates,
          result.fixedCoordinates,
          polygonUtilService,
        ),
        `Visual comparison of test "${key}"`,
      );
      expect(result).toMatchObject({
        fixedCoordinates: expectedFixedCoordinates,
        warningsAfterFixAttempt: [
          {
            fixed: true,
            key: 'Spikes',
          },
          {
            fixed: true,
            key: 'Self-intersects',
          },
        ],
      });
    });

    it('NNT-2093 - spike at start that doesnt get fixed', async () => {
      const key = 'NNT-2093';
      const originalCoordinates = [
        [30.0238761, 0.6655204],
        [30.0241499, 0.6656975],
        [30.0240341, 0.6656158],
        [30.0239399, 0.6655503],
        [30.0239107, 0.6655367],
        [30.023893, 0.6655117],
        [30.0238769, 0.6654896],
        [30.0238688, 0.6654622],
        [30.023862, 0.6654341],
        [30.0238589, 0.6654021],
        [30.0238594, 0.665374],
        [30.0238725, 0.6653467],
        [30.0238992, 0.6653322],
        [30.0239227, 0.6653137],
        [30.0239533, 0.66532],
        [30.0239675, 0.6653472],
        [30.0239889, 0.6653674],
        [30.0240087, 0.6653935],
        [30.0240177, 0.6654207],
        [30.0239949, 0.6654429],
        [30.023978, 0.6654681],
        [30.0239554, 0.665487],
        [30.0239387, 0.6655086],
        [30.0238761, 0.6655204],
      ];
      const warnings = polygonUtilService.completePolygonAndGetWarnings(
        originalCoordinates,
        PlotCoordinateSources.ORIJIN_APP,
      );
      expect(warnings.polygonWarnings).toMatchObject([
        {
          fixed: false,
          key: 'Spikes',
        },
        {
          fixed: false,
          key: 'Self-intersects',
        },
      ]);
      const result = polygonUtilService.fixPolygon(
        originalCoordinates,
        warnings.polygonWarnings,
        PlotCoordinateSources.ORIJIN_APP,
        key,
      );
      logger.debug(
        createVisualComparison(
          originalCoordinates,
          result.fixedCoordinates,
          polygonUtilService,
        ),
        `Visual comparison of test "${key}"`,
      );
      const expectedFixedCoordinates = [
        [30.0239107, 0.6655367],
        [30.0239399, 0.6655503],
        [30.0240177, 0.6654207],
        [30.0240087, 0.6653935],
        [30.0239889, 0.6653674],
        [30.0239533, 0.66532],
        [30.0239227, 0.6653137],
        [30.0238725, 0.6653467],
        [30.0238594, 0.665374],
        [30.0238589, 0.6654021],
        [30.023862, 0.6654341],
        [30.0238761, 0.6655204],
        [30.0239107, 0.6655367],
      ];
      expect(result).toMatchObject({
        fixedCoordinates: expectedFixedCoordinates,
        warningsAfterFixAttempt: [
          {
            fixed: true,
            key: 'Spikes',
          },
          {
            fixed: true,
            key: 'Self-intersects',
          },
        ],
      });
    });

    it('GLA-2029 - small intersection', async () => {
      const key = 'GLA-2029';
      const originalCoordinates = [
        [30.02826, 0.632205],
        [30.0283271, 0.6321778],
        [30.0282791, 0.6322142],
        [30.0282095, 0.632234],
        [30.0281758, 0.6322249],
        [30.028119, 0.6322135],
        [30.0280908, 0.6322242],
        [30.0280356, 0.6322272],
        [30.0280059, 0.6322271],
        [30.0279797, 0.6322398],
        [30.0279895, 0.6322746],
        [30.0280025, 0.6323022],
        [30.0280249, 0.6323213],
        [30.028042, 0.6323446],
        [30.028055, 0.6323727],
        [30.028057, 0.6324055],
        [30.0280737, 0.6324319],
        [30.0280809, 0.6324588],
        [30.0280841, 0.6324882],
        [30.0280992, 0.6325157],
        [30.028142, 0.6324904],
        [30.0281641, 0.6324687],
        [30.0281813, 0.6324421],
        [30.0282026, 0.632417],
        [30.028247, 0.6323787],
        [30.028267, 0.6323535],
        [30.02828, 0.6323263],
        [30.0283005, 0.6323013],
        [30.0283011, 0.6322729],
        [30.0282966, 0.6322406],
        [30.0282955, 0.6322116],
        [30.02826, 0.632205],
      ];
      const warnings = polygonUtilService.completePolygonAndGetWarnings(
        originalCoordinates,
        PlotCoordinateSources.ORIJIN_APP,
      );
      const result = polygonUtilService.fixPolygon(
        originalCoordinates,
        warnings.polygonWarnings,
        PlotCoordinateSources.ORIJIN_APP,
        key,
      );
      logger.debug(
        createVisualComparison(
          originalCoordinates,
          result.fixedCoordinates,
          polygonUtilService,
        ),
        `Visual comparison of test "${key}"`,
      );
      expect(result).toMatchObject({
        fixedCoordinates: expect.anything(),
        warningsAfterFixAttempt: [
          {
            fixed: true,
            key: 'Self-intersects',
          },
        ],
      });
    });

    it('NNT-0129 - unfixable', async () => {
      const coordinates = [
        [30.0179485, 0.6603554], // repeats many times..
        [30.0381752, 0.6715408], // repeats 2 times
        [30.0179485, 0.6603554],
        [30.0233666, 0.667781], // repeats many times..
        [30.0179485, 0.6603554], // ..etc
        [30.0381752, 0.6715408],
        [30.0179485, 0.6603554],
        [30.0233666, 0.667781],
        [30.0374529, 0.6692299],
        [30.0233666, 0.667781],
        [30.0179485, 0.6603554],
        [30.0233666, 0.667781],
        [30.0374529, 0.6692299],
        [30.0233666, 0.667781],
        [30.0179485, 0.6603554],
        [30.0385363, 0.6679361],
        [30.0233666, 0.667781],
        [30.0374529, 0.6692299],
        [30.0233666, 0.667781],
        [30.0179485, 0.6603554],
      ];
      const warnings = polygonUtilService.completePolygonAndGetWarnings(
        coordinates,
        PlotCoordinateSources.ORIJIN_APP,
      );
      expect(warnings.polygonWarnings).toMatchObject([
        {
          fixed: false,
          key: 'Spikes',
        },
        {
          fixed: false,
          key: 'Self-intersects',
        },
      ]);
      const result = polygonUtilService.fixPolygon(
        coordinates,
        warnings.polygonWarnings,
        PlotCoordinateSources.ORIJIN_APP,
        'NNT-0129',
      );
      expect(result).toBeNull(); // Can't fix so sending back null
    });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});

// {
//   "type": "FeatureCollection",
//   "features": [
//   {
//     "type": "Feature",
//     "properties": {},
//     "geometry": {
//       "coordinates": [30.0650605, 0.6935391],
//       "type": "Point"
//     },
//     "id": 0
//   },
//   {
//     "type": "Feature",
//     "properties": {},
//     "geometry": {
//       "coordinates": [
//         [
//           [30.0650605, 0.6935391],
//           [30.0651241, 0.6935844],
//           [30.065052, 0.6934971],
//           [30.0650448, 0.693524],
//           [30.0650431, 0.6935552],
//           [30.065068, 0.693569],
//           [30.0650973, 0.6935727],
//           [30.0651263, 0.6935705],
//           [30.0651497, 0.6935564],
//           [30.0651207, 0.6935463],
//           [30.0650698, 0.6935103]
//         ]
//       ],
//       "type": "Polygon"
//     }
//   }
// ]
// }
