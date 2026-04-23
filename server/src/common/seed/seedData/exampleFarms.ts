import { FacilityType } from '../../../facilities/models/facility.model';
import {
  PlotCoordinateSources,
  PlotType,
} from '../../../farms/models/plots.model';
import { FacilitiesDto } from '../../../facilities/dto/facilities.dto';
import { FarmInputValues, FarmsDto } from '../../../farms/dto/farms.dto';
import {
  Location,
  MhCustomLocationLevels,
} from '../../../locations/models/locations.model';
import { UserType } from '../../../users/models/user.model';

interface ExampleFarm extends FarmsDto {
  autofixedCoordinates?: number[][];
}

const countryIso = 'UGA';

export const examplePersons = (organisation) => [
  {
    shortCode: 'FARM-1',
    organisation,
    type: UserType.Farmer,
    email: '',
    phone: '778434715',
    firstName: 'JOSTINA',
    lastName: 'BUSABUTAMA',
    gender: 'Female',
    dateOfBirth: new Date('1980-12-10T00:00:00.000Z'),
    dateOfBirthApproximate: false,
    identificationNumberType: 'NationalId',
    identificationNumber: 'CF800011111',
    education: '',
    maritalStatus: 'Married',
  },
  {
    shortCode: 'FARM-2',
    organisation,
    type: UserType.Farmer,
    email: '',
    phone: '4321433243',
    firstName: 'GWENDO',
    lastName: 'STEFAN',
    gender: 'Male',
    dateOfBirth: new Date('1977-12-10T00:00:00.000Z'),
    dateOfBirthApproximate: false,
    identificationNumberType: 'NationalId',
    identificationNumber: 'CF80002222',
    education: '',
    maritalStatus: 'Single',
  },
  {
    shortCode: 'FARM-3',
    organisation,
    type: UserType.Farmer,
    email: '',
    phone: '4321433243',
    firstName: 'SAD',
    lastName: 'MAN',
    gender: 'Male',
    dateOfBirth: new Date('1977-12-10T00:00:00.000Z'),
    dateOfBirthApproximate: false,
    identificationNumber: null,
    identificationNumberType: null,
    education: '',
    maritalStatus: 'single',
  },
  {
    shortCode: 'FARM-4',
    organisation,
    type: UserType.Farmer,
    email: '',
    phone: '4321433243',
    firstName: 'Leo',
    lastName: 'Thornton',
    gender: 'Male',
    dateOfBirth: new Date('1978-12-10T00:00:00.000Z'),
    dateOfBirthApproximate: false,
    identificationNumber: null,
    identificationNumberType: null,
    education: '',
    maritalStatus: 'single',
  },
  {
    shortCode: 'FARM-5',
    organisation,
    type: UserType.Farmer,
    email: '',
    phone: '4321433',
    firstName: 'Boss',
    lastName: 'Lady',
    gender: 'Female',
    dateOfBirth: new Date('1978-12-10T00:00:00.000Z'),
    dateOfBirthApproximate: false,
    identificationNumber: null,
    identificationNumberType: null,
    education: '',
    maritalStatus: 'single',
  },
];

export const getExampleFarmInputs = (
  organisation: string,
  locations?: Location[],
  customLocations?: Location[],
  seasonCode?: string,
): ExampleFarm[] => [
  // 1st
  {
    organisation,
    facilityValues: {
      organisation,
      shortCode: 'FARM-001',
      name: 'ADELE KAMBALA',
      type: FacilityType.Farm,
      areaTotalManual: 2,
      location: locations ? locations[0] : null,
      customLocation: customLocations
        ? customLocations.filter(
            (loc) => loc.type === MhCustomLocationLevels.FARMER_GROUP,
          )[0]
        : null,
      mainContactPerson: examplePersons(organisation)[0],
      countryIso,
    },
    farmValues: {
      seasonCode,
      plots: [
        {
          organisation: organisation,
          shortCode: 'FARM-1-CODE-1',
          name: 'am I really needed?',
          type: PlotType.Permanent,
          // The polygons are self-intersecting up on purpose, inserting should auto-fix them.
          polygonCoordinates: [
            [30.1701571, 0.8488141],
            [30.1705245, 0.8487271],
            [30.1704467, 0.8488129],
            [30.1702282, 0.8487563],
            [30.1700357, 0.8486596],
          ],
          polygonSource: PlotCoordinateSources.IMPORT,
        },
      ],
    },
    autofixedCoordinates: [
      [30.1701571, 0.8488141],
      [30.1705245, 0.8487271],
      [30.1704467, 0.8488129],
      [30.1702282, 0.8487563],
      [30.1700357, 0.8486596],
      [30.1701571, 0.8488141],
    ],
  },
  // 2nd Farm: Plot with incomplete polygon
  {
    organisation,
    facilityValues: {
      organisation,
      shortCode: 'FARM-002',
      name: 'GWENDO STEFAN',
      type: FacilityType.Farm,
      areaTotalManual: 5,
      location: locations ? locations[1] : null,
      customLocation: customLocations
        ? customLocations.filter(
            (loc) => loc.type === MhCustomLocationLevels.FARMER_GROUP,
          )[0]
        : null,
      mainContactPerson: examplePersons(organisation)[1],
      countryIso,
    },
    farmValues: {
      seasonCode,
      plots: [
        {
          organisation: organisation,
          shortCode: 'FARM-2-PLOT-1',
          name: 'am I really needed?',
          type: PlotType.Permanent,
          // The polygon is not complete (last does not equal to first)
          polygonCoordinates: [
            [32.44280716313785, 1.395156676467579],
            [32.443494691071805, 1.3968533259032034],
            [32.44467631196789, 1.397934927406471],
          ],
          polygonSource: PlotCoordinateSources.IMPORT,
        },
      ],
    },
  },
  // 3rd Farm: Plot without coordinates
  {
    organisation,
    facilityValues: {
      organisation,
      shortCode: 'FARM-003',
      name: 'NO POLYGONS MAN',
      type: FacilityType.Farm,
      areaTotalManual: 0,
      // coordinate: { longitude: 0.858141, latitude: 30.1731571 },
      location: locations ? locations[1] : null,
      customLocation: customLocations
        ? customLocations.filter(
            (loc) => loc.type === MhCustomLocationLevels.FARMER_GROUP,
          )[0]
        : null,
      mainContactPerson: examplePersons(organisation)[2],
      countryIso,
    },
    farmValues: {
      seasonCode,
      plots: [
        {
          organisation: organisation,
          shortCode: 'FARM-3-PLOT-1',
          name: 'am I really needed?',
          type: PlotType.Permanent,
        },
      ],
    },
  },
  // 4th Farm: For Farm inspection
  // because it is updated by farm inspection (FOR TWO SEASONS) by the code in seedFarms.ts
  {
    organisation,
    facilityValues: {
      organisation,
      shortCode: 'FARM-004',
      name: 'FARM INSPECTION DUDE',
      type: FacilityType.Farm,
      areaTotalManual: 0.5,
      // coordinate: { longitude: 0.858141, latitude: 30.1731571 },
      location: locations?.find((l) => l.shortCode === 'BBI') || null,
      customLocation: customLocations
        ? customLocations.filter(
            (loc) => loc.type === MhCustomLocationLevels.FARMER_GROUP,
          )[0]
        : null,
      mainContactPerson: examplePersons(organisation)[3],
    },
    farmValues: {
      seasonCode,
      plots: [
        {
          organisation: organisation,
          shortCode: 'FARM-004 - P1',
          name: 'Single point plot',
          type: PlotType.Permanent,
          polygonCoordinates: [[30.1731571, 0.858141]],
          polygonSource: PlotCoordinateSources.IMPORT,
        },
        {
          organisation: organisation,
          shortCode: 'FARM-004 - PDEL',
          name: 'Nice place by the river',
          type: PlotType.Permanent,
          polygonCoordinates: [
            [30.1701571, 0.8488141],
            [30.1705245, 0.8487271],
            [30.1704467, 0.8488129],
            [30.1702282, 0.8487563],
            [30.1700357, 0.8486596],
          ],
          polygonSource: PlotCoordinateSources.IMPORT,
        },
      ],
    },
  },
  // 5th Farm: Single points
  {
    organisation,
    facilityValues: {
      organisation,
      shortCode: 'FARM-005',
      name: 'SINGLE POINT PLOT',
      type: FacilityType.Farm,
      areaTotalManual: 0.5,
      // coordinate: { longitude: 0.858141, latitude: 30.1731571 },
      location: locations ? locations[1] : null,
      customLocation: customLocations
        ? customLocations.filter(
            (loc) => loc.type === MhCustomLocationLevels.FARMER_GROUP,
          )[0]
        : null,
      mainContactPerson: examplePersons(organisation)[4],
    },
    farmValues: {
      seasonCode,
      plots: [
        {
          organisation: organisation,
          shortCode: 'FARM-005 - P1',
          name: 'Single point plot',
          type: PlotType.Permanent,
          polygonCoordinates: [[30.1731571, 0.858141]],
          polygonSource: PlotCoordinateSources.IMPORT,
        },
        {
          organisation: organisation,
          shortCode: 'FARM-005 - P2',
          name: 'Single point plot',
          type: PlotType.Permanent,
          polygonCoordinates: [[30.176, 0.91]],
          polygonSource: PlotCoordinateSources.IMPORT,
        },
        {
          organisation: organisation,
          shortCode: 'FARM-005 - P3',
          name: 'Single point plot',
          type: PlotType.Permanent,
          polygonCoordinates: [[30.18, 0.92]],
          polygonSource: PlotCoordinateSources.IMPORT,
        },
        {
          organisation: organisation,
          shortCode: 'FARM-005 - P4',
          name: 'Nice place by the river',
          type: PlotType.Permanent,
        },
      ],
    },
  },
  // 6th Farm: Impossible polygon
  {
    organisation,
    facilityValues: {
      organisation,
      shortCode: 'FARM-006',
      name: 'IMPOSSIBLE POLYGON',
      type: FacilityType.Farm,
      areaTotalManual: 0.4,
      // coordinate: { longitude: 0.858141, latitude: 30.1731571 },
      location: locations ? locations[1] : null,
      customLocation: customLocations
        ? customLocations.filter(
            (loc) => loc.type === MhCustomLocationLevels.FARMER_GROUP,
          )[0]
        : null,
      mainContactPerson: examplePersons(organisation)[5],
    },
    farmValues: {
      seasonCode,
      plots: [
        {
          organisation: organisation,
          shortCode: 'FARM-006 - P1',
          name: 'Crazy plot',
          type: PlotType.Permanent,
          polygonCoordinates: [
            [30.1731571, 0.858141],
            [34.1731571, 0.958141],
            [36.1731571, 3.958141],
          ],
          polygonSource: PlotCoordinateSources.ORIJIN_APP,
        },
      ],
    },
  },
  {
    organisation,
    facilityValues: {
      organisation,
      shortCode: 'FARM-007',
      name: 'SEASON HISTORY',
      type: FacilityType.Farm,
      areaTotalManual: 0.4,
      // coordinate: { longitude: 0.858141, latitude: 30.1731571 },
      location: locations ? locations[1] : null,
      customLocation: customLocations
        ? customLocations.filter(
            (loc) => loc.type === MhCustomLocationLevels.FARMER_GROUP,
          )[0]
        : null,
      mainContactPerson: examplePersons(organisation)[5],
    },
    farmValues: {
      seasonCode,
      plots: [
        {
          organisation: organisation,
          shortCode: 'FARM-007 - P1',
          name: 'HISTORY PLOT',
          type: PlotType.Permanent,
          polygonCoordinates: [
            [24.679844494619488, -12.774827576969258],
            [24.679844494619488, -12.775461901958664],
            [24.680905716060323, -12.775461901958664],
            [24.680905716060323, -12.774827576969258],
            [24.679844494619488, -12.774827576969258],
          ],
          polygonSource: PlotCoordinateSources.ORIJIN_APP,
        },
      ],
    },
  },
];

const overlappingCoordinates = [
  [
    [24.675041253842693, -12.776901636275312],
    [24.66957071671206, -12.78024407324861],
    [24.66959268673918, -12.781229655195276],
    [24.672910161064948, -12.781658167885112],
    [24.675041253842693, -12.776901636275312],
  ],

  [
    [24.671394229088378, -12.77478045141396],
    [24.670273757628394, -12.779044229166843],
    [24.672756370865102, -12.775894611338956],
    [24.671394229088378, -12.77478045141396],
  ],

  [
    [24.669011359682543, -12.774984444057758],
    [24.668896636990766, -12.774989940484595],
    [24.668783019126366, -12.775006376832222],
    [24.668671600277214, -12.775033594811743],
    [24.668563453454574, -12.775071332302563],
    [24.668459620159922, -12.775119225876635],
    [24.668361100355188, -12.775176814298282],
    [24.6682688428329, -12.775243542965944],
    [24.668183736079108, -12.775318769253035],
    [24.668106599716907, -12.775401768696533],
    [24.668038176613102, -12.775491741973664],
    [24.667979125723903, -12.775587822599553],
    [24.6679300157487, -12.775689085271662],
    [24.667891319652863, -12.775794554780736],
    [24.667863410112485, -12.775903215402362],
    [24.667846555924864, -12.776014020678783],
    [24.667840919419316, -12.776125903496732],
    [24.667846554893334, -12.776237786364218],
    [24.66786340808906, -12.77634859178736],
    [24.6678913167153, -12.776457252647242],
    [24.667930012009897, -12.776562722476958],
    [24.667979121327537, -12.776663985539773],
    [24.668038171728117, -12.776760066611413],
    [24.668106594531043, -12.77685004037221],
    [24.668183730791643, -12.776933040318704],
    [24.668268837647034, -12.777008267108792],
    [24.668361095470203, -12.777074996260122],
    [24.66845961576356, -12.777132585127518],
    [24.668563449715773, -12.777180479092292],
    [24.66867159733966, -12.777218216903755],
    [24.668783017102943, -12.777245435121534],
    [24.668896635959232, -12.777261871615883],
    [24.669011359682543, -12.777267368092259],
    [24.669126083405857, -12.777261871615883],
    [24.669239702262143, -12.777245435121534],
    [24.66935112202543, -12.777218216903755],
    [24.669459269649312, -12.777180479092292],
    [24.66956310360153, -12.777132585127518],
    [24.66966162389488, -12.777074996260122],
    [24.66975388171805, -12.777008267108792],
    [24.669838988573442, -12.776933040318704],
    [24.669916124834042, -12.77685004037221],
    [24.66998454763697, -12.776760066611413],
    [24.67004359803755, -12.776663985539773],
    [24.67009270735519, -12.776562722476958],
    [24.670131402649783, -12.776457252647242],
    [24.670159311276027, -12.77634859178736],
    [24.670176164471755, -12.776237786364218],
    [24.670181799945766, -12.776125903496732],
    [24.67017616344022, -12.776014020678783],
    [24.670159309252597, -12.775903215402362],
    [24.670131399712222, -12.775794554780736],
    [24.670092703616387, -12.775689085271662],
    [24.670043593641186, -12.775587822599553],
    [24.669984542751987, -12.775491741973664],
    [24.669916119648175, -12.775401768696533],
    [24.669838983285977, -12.775318769253035],
    [24.669753876532184, -12.775243542965944],
    [24.6696616190099, -12.775176814298282],
    [24.669563099205163, -12.775119225876635],
    [24.669459265910515, -12.775071332302563],
    [24.669351119087867, -12.775033594811743],
    [24.669239700238716, -12.775006376832222],
    [24.669126082374323, -12.774989940484595],
    [24.669011359682543, -12.774984444057758],
  ],

  [
    [24.67377025063837, -12.776183645577575],
    [24.675769415620664, -12.781341145915405],
    [24.677292035461335, -12.777827256016892],
    [24.67377025063837, -12.776183645577575],
  ],

  [
    [24.66819862258575, -12.773913201145305],
    [24.664588725335392, -12.778192210727951],
    [24.665586583112002, -12.779880896907812],
    [24.66831601761797, -12.778922068004718],
    [24.66819862258575, -12.773913201145305],
  ],

  [
    [24.673357369562666, -12.773837564612961],
    [24.67635767326871, -12.775353646820662],
    [24.677119408406924, -12.773140163743122],
    [24.673357369562666, -12.773837564612961],
  ],

  [
    [24.672813273036724, -12.772836945373655],
    [24.672813273036724, -12.774732054215946],
    [24.674585473152177, -12.774732054215946],
    [24.674585473152177, -12.772836945373655],
    [24.672813273036724, -12.772836945373655],
  ],
  [
    [24.67063583115538, -12.774193250387526],
    [24.67063583115538, -12.777298096897297],
    [24.67248441043901, -12.777298096897297],
    [24.67248441043901, -12.774193250387526],
    [24.67063583115538, -12.774193250387526],
  ],
  [
    [24.68022105706595, -12.77527828173092],
    [24.677619352890844, -12.776129610752477],
    [24.67929676742483, -12.777965800838729],
    [24.68022105706595, -12.77527828173092],
  ],
  [
    [24.679844494619488, -12.774827576969258],
    [24.679844494619488, -12.775461901958664],
    [24.680905716060323, -12.775461901958664],
    [24.680905716060323, -12.774827576969258],
    [24.679844494619488, -12.774827576969258],
  ],
];
const generateOverlappingPlots = (count: number, chance, shortCode) => {
  const plots = [];
  for (let i = 0; i < 1; i++) {
    plots.push({
      shortCode: shortCode + '-' + chance.guid().substring(0, 4),
      name: chance.word({ length: 5 }),
      type: chance.pickone([PlotType.Permanent]),
      polygonCoordinates: overlappingCoordinates[count],
      polygonSource: PlotCoordinateSources.IMPORT,
    });
  }
  return plots;
};

export const generateOverlappingFarm = (
  index: number,
  organisation: string,
  chance: Chance.Chance,
  seasonCode?: string,
): ExampleFarm => {
  const name = chance.name();
  const shortCode = 'OVERL-' + String(index).padStart(3, '0');
  const plots = generateOverlappingPlots(index, chance, shortCode);
  return {
    organisation,
    facilityValues: {
      organisation,
      shortCode: shortCode,
      name: name,
      type: FacilityType.Farm,
      areaTotalManual: chance.floating({ min: 1, max: 10, fixed: 2 }),
      mainContactPerson: {
        shortCode: 'OVERL-' + index,
        organisation,
        type: UserType.Farmer,
        email: chance.email(),
        phone: chance.phone(),
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        gender: chance.gender(),
        dateOfBirth: chance.birthday(),
        dateOfBirthApproximate: false,
        identificationNumberType: 'NationalId-OV',
        identificationNumber: chance
          .natural({ min: 1000000000, max: 9999999999 })
          .toString(),
        education: chance.pickone(['Primary', 'Secondary', 'Tertiary', 'None']),
        maritalStatus: chance.pickone([
          'Single',
          'Married',
          'Divorced',
          'Widowed',
        ]),
      },
    },
    farmValues: {
      seasonCode,
      plots: plots,
    },
  };
};
