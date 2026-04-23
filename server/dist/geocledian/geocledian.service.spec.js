"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _geocledianservice = require("./geocledian.service");
const _farmsmodel = require("../farms/models/farms.model");
const _facilitymodel = require("../facilities/models/facility.model");
const _client = require("@prisma/client");
const _jest = require("@automock/jest");
const _plotsmodel = require("../farms/models/plots.model");
describe('GeocledianService', ()=>{
    let geocledianService;
    beforeEach(async ()=>{
        // const app: TestingModule = await Test.createTestingModule({
        //   imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
        //   providers: [
        //     ConfigService,
        //     FarmAnalysisService,
        //     {
        //       provide: FarmsService,
        //       useValue: {
        //         getAll: jest.fn().mockResolvedValue([]),
        //       },
        //     },
        //   ],
        // }).compile();
        // app.useLogger(new Logger());
        // farmAnalysisService = app.get<FarmAnalysisService>(FarmAnalysisService);
        const { unit, unitRef } = _jest.TestBed.create(_geocledianservice.GeocledianService).compile();
        geocledianService = unit;
    // logger = unitRef.get(Logger);
    // database = unitRef.get(Database);
    });
    describe('Farm Analysis tests', ()=>{
        const name = 'Test farm';
        const plotShortCode = 'PLOT-SHORTCODE-1';
        const today = '2024-07-31';
        const getTestFarm = ()=>{
            const dates = {
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            };
            const plot = {
                distanceToForest: 0,
                distanceToForestKnown: false,
                establishedBefore2020: false,
                hasLandTitle: false,
                hasRightToLand: false,
                hasShadeTrees: false,
                ownerName: '',
                principalLeasesLand: false,
                principalOwnsLand: false,
                traditionalOwners: false,
                traditionalOwnersPresent: false,
                status: '',
                active: false,
                areaSizeManual: 0,
                areaSizeOrganicManual: 0,
                certificationStatus: '',
                createdAt: undefined,
                cultivationStartDate: undefined,
                deletedAt: undefined,
                farmId: '',
                firestoreId: '',
                interCropped: false,
                lastChemicalUseDate: undefined,
                name: '',
                registrationDate: undefined,
                shortCode: plotShortCode,
                updatedAt: undefined,
                yieldEstimateProcessed: 0,
                yieldEstimateRaw: 0,
                id: '',
                type: _plotsmodel.PlotType.Permanent,
                polygons: [
                    {
                        id: '',
                        shortCode: '',
                        ...dates,
                        active: true,
                        status: '',
                        areaCalculated: new _client.Prisma.Decimal(1.0),
                        coordinates: [
                            [
                                30.0320359,
                                0.6433227
                            ],
                            [
                                30.0321605,
                                0.6432342
                            ],
                            [
                                30.0321559,
                                0.642957
                            ],
                            [
                                30.031701,
                                0.6431071
                            ],
                            [
                                30.0321605,
                                0.6432342
                            ],
                            [
                                30.0320359,
                                0.6433227
                            ]
                        ],
                        source: '',
                        plotId: 'abc-123'
                    }
                ]
            };
            const farm = {
                certificationStartDate: undefined,
                certifications: [],
                contractDate: undefined,
                firestoreId: '',
                firstVisitDate: undefined,
                houseHoldCoordinateId: '',
                lastChemicalUseDate: undefined,
                lastInspectionDate: undefined,
                registrationDate: undefined,
                id: 'fake-id',
                organisation: 'mh',
                seasonId: '',
                parentFacilityName: '',
                facility: {
                    id: '',
                    name,
                    type: _facilitymodel.FacilityType.Farm,
                    countryIso: 'UGA',
                    address: {
                        street: '',
                        postalCode: '',
                        text: '',
                        city: '',
                        state: '',
                        region: '',
                        municipality: '',
                        district: '',
                        subCounty: '',
                        parish: '',
                        village: '',
                        countryCode: '',
                        country: ''
                    },
                    shortCode: '',
                    organisation: '',
                    firestoreId: '',
                    areaTotalManual: new _client.Prisma.Decimal(24.454545),
                    locationId: '',
                    customLocationId: '',
                    coordinateId: '',
                    mainContactPersonId: '',
                    timezone: '',
                    ...dates
                },
                plots: [
                    plot
                ],
                certificationStatus: _farmsmodel.CertificationStatus.Certified,
                approvalStatus: _farmsmodel.ReviewStatus.Approved,
                creationStatus: _farmsmodel.CreationStatus.DataImport,
                ...dates
            };
            return farm;
        };
        it('Should convert a Farm to a Geocledian Parcel', async ()=>{
            const result = geocledianService.convertFarmToParcels(getTestFarm());
            expect(result).toEqual([
                {
                    coordinates: [
                        [
                            [
                                30.0320359,
                                0.6433227
                            ],
                            [
                                30.0321605,
                                0.6432342
                            ],
                            [
                                30.0321559,
                                0.642957
                            ],
                            [
                                30.031701,
                                0.6431071
                            ],
                            [
                                30.0321605,
                                0.6432342
                            ],
                            [
                                30.0320359,
                                0.6433227
                            ]
                        ]
                    ],
                    properties: {
                        commodity: 'cocoa',
                        country_iso: 'UGA',
                        entity: name,
                        name: name,
                        foreign_id: '',
                        point_buffer_area: 1,
                        process_timeseries: true,
                        production_start: '2020-01-01',
                        production_end: today
                    },
                    plotId: ''
                }
            ]);
        });
    // it('Should submit an analysis request', async () => {
    //   const farm = await getTestFarm();
    //   this.farmService.create(farm);
    //   const result = await geocledianService.submitAnalysisRequest(farm.id);
    //   expect(result).toEqual({});
    // });
    });
});
