"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedFarms", {
    enumerable: true,
    get: function() {
        return seedFarms;
    }
});
const _exampleFarms = require("./seedData/exampleFarms");
const _geocledianmodel = require("../../geocledian/geocledian.model");
const _chance = require("chance");
const _plotsmodel = require("../../farms/models/plots.model");
const _facilitymodel = require("../../facilities/models/facility.model");
const _usermodel = require("../../users/models/user.model");
const _seedPolygons = require("./seedPolygons");
const _farmInspectionResultjson = require("./seedData/farmInspectionResult.json");
const chance = new _chance.Chance();
const generateRandomPlots = (count)=>{
    const plots = [];
    for(let i = 0; i < count; i++){
        plots.push({
            shortCode: 'PLOT-' + chance.guid(),
            name: chance.word({
                length: 5
            }),
            type: chance.pickone([
                _plotsmodel.PlotType.Permanent
            ]),
            polygonCoordinates: (0, _seedPolygons.generatePolygon)({
                lat: 30.111,
                long: 0.6111
            }, 0.1, 0.004),
            polygonSource: _plotsmodel.PlotCoordinateSources.IMPORT
        });
    }
    return plots;
};
const generateOffsetFromVertex = (coordinates)=>{
    const vertexIndex = Math.floor(Math.random() * coordinates.length); // Select a random vertex
    const vertex = coordinates[vertexIndex];
    const maxDistance = 0.003; // Max distance to offset from the vertex
    const angle = Math.random() * 2 * Math.PI; // Random angle
    const distance = Math.random() * maxDistance; // Random distance up to maxDistance
    return {
        latitude: vertex[0] + distance * Math.sin(angle),
        longitude: vertex[1] + distance * Math.cos(angle)
    };
};
const generateRandomFarm = (index, organisation, location, seasonCode)=>{
    const name = chance.name();
    const plots = generateRandomPlots(chance.integer({
        min: 1,
        max: 5
    }));
    const firstPlot = plots[0];
    const farmHouseLocation = generateOffsetFromVertex(firstPlot.polygonCoordinates);
    return {
        organisation,
        facilityValues: {
            organisation,
            shortCode: 'RANDO-' + String(index).padStart(3, '0'),
            name: name,
            type: _facilitymodel.FacilityType.Farm,
            areaTotalManual: chance.floating({
                min: 1,
                max: 10,
                fixed: 2
            }),
            location: location,
            coordinate: farmHouseLocation,
            mainContactPerson: {
                shortCode: 'RANDO-' + index,
                organisation,
                type: _usermodel.UserType.Farmer,
                email: chance.email(),
                phone: chance.phone(),
                firstName: name.split(' ')[0],
                lastName: name.split(' ')[1],
                gender: chance.gender(),
                dateOfBirth: chance.birthday(),
                dateOfBirthApproximate: false,
                identificationNumberType: 'NationalId',
                identificationNumber: chance.natural({
                    min: 1000000000,
                    max: 9999999999
                }).toString(),
                education: chance.pickone([
                    'Primary',
                    'Secondary',
                    'Tertiary',
                    'None'
                ]),
                maritalStatus: chance.pickone([
                    'Single',
                    'Married',
                    'Divorced',
                    'Widowed'
                ])
            }
        },
        farmValues: {
            seasonCode,
            plots: plots
        }
    };
};
const addSatelliteForFarmOne = async (farmOne, prisma)=>{
    await prisma.satelliteAnalysis.create({
        data: {
            status: _geocledianmodel.GeocledianStatus.ANALYZED,
            parcelId: '48532',
            entity: 'test',
            name: 'test',
            // See server/test/geocledian.e2e-spec.ts for good sample data
            area: 0.3679,
            countryIso: 'TZA',
            countryRisk: 'standard',
            deforestationAreaHa: 0,
            deforestationRisk: 'low',
            landcoverForestCoverage: 0.08,
            landcoverNoTreesCoverage: 0.92,
            landcoverPlantationCoverage: 0,
            landcoverShrubsCoverage: 0,
            plot: {
                connect: {
                    id: farmOne.plots[0].id
                }
            },
            rawData: JSON.stringify({
                hello: true
            })
        }
    });
};
const addSatelliteForFarmTwo = async (farmTwo, prisma)=>{
    const area = farmTwo.plots[0].polygons.find((poly)=>poly.active).areaCalculated.toNumber();
    const forestsCoverage = 0.2 * area;
    const noTreesCoverage = 0.4 * area;
    const plantation = 0.2 * area;
    const shrubs = area - forestsCoverage - noTreesCoverage - plantation;
    const deforestation = 0.5 * area;
    await prisma.satelliteAnalysis.create({
        data: {
            status: _geocledianmodel.GeocledianStatus.ANALYZED,
            parcelId: '48534',
            entity: 'test',
            name: 'test',
            // See server/test/geocledian.e2e-spec.ts for good sample data
            area: area,
            countryIso: 'TZA',
            countryRisk: 'standard',
            deforestationAreaHa: deforestation,
            deforestationRisk: 'high',
            landcoverForestCoverage: forestsCoverage,
            landcoverNoTreesCoverage: noTreesCoverage,
            landcoverPlantationCoverage: plantation,
            landcoverShrubsCoverage: shrubs,
            plot: {
                connect: {
                    id: farmTwo.plots[0].id
                }
            },
            rawData: JSON.stringify({
                hello: true
            })
        }
    });
};
const addCertifications = async (farmOne, certificationTypes, prisma)=>{
    const certFarm = await prisma.certification.create({
        data: {
            organisation: farmOne.organisation,
            status: 'Certified',
            startsAt: new Date(),
            certificationType: {
                connect: {
                    id: certificationTypes[0].id
                }
            },
            farm: {
                connect: {
                    id: farmOne.id
                }
            }
        }
    });
    const certPlot = await prisma.certification.create({
        data: {
            organisation: farmOne.organisation,
            status: 'Certified',
            startsAt: new Date(),
            certificationType: {
                connect: {
                    id: certificationTypes[0].id
                }
            },
            plot: {
                connect: {
                    id: farmOne.plots[0].id
                }
            }
        }
    });
};
const addContactAndWallet = async (farmOne, prisma)=>{
    const contact = await prisma.contact.create({
        data: {
            organisation: farmOne.organisation,
            type: 'mobilePhone',
            phone: '+256779364863',
            firstName: 'Adam',
            lastName: 'Jones',
            address: 'Some address',
            primary: true,
            person: {
                connect: {
                    id: farmOne.facility.mainContactPerson.id
                }
            },
            shortCode: '+256779364863'
        }
    });
    await prisma.wallet.create({
        data: {
            organisation: farmOne.organisation,
            type: 'MMWallet',
            externalSystemName: 'OneAfriq',
            externalId: '+256779364863',
            externalUuid: '12345678',
            phone: '+256779364863',
            externalName: 'Adam Jones',
            externalFirstName: 'Adan',
            externalLastName: 'Jones',
            contact: {
                connect: {
                    id: contact.id
                }
            },
            shortCode: '+256779364863'
        }
    });
};
const receiveFarmInspectionFromV1ForFarm = async (farmWithInspection, farmInspectionService, activeSeason, previousSeason, farmInspectionResult)=>{
    if (farmWithInspection) {
        await farmInspectionService.process(farmInspectionResult, farmWithInspection.organisation);
        if (previousSeason) {
            const previousSeasonInspectionResult = {
                ...farmInspectionResult,
                entity: {
                    ...farmInspectionResult.entity,
                    season: {
                        id: previousSeason.id,
                        label: previousSeason.shortCode,
                        labelShort: previousSeason.shortCode
                    }
                }
            };
            await farmInspectionService.process(previousSeasonInspectionResult, farmWithInspection.organisation);
        } else {
            console.warn('No previous season found in db');
        }
        farmInspectionResult.entity.season = {
            id: activeSeason.id,
            label: activeSeason.shortCode,
            labelShort: activeSeason.shortCode
        };
        await farmInspectionService.process(farmInspectionResult, farmWithInspection.organisation);
    } else {
        console.warn('Seed data does not contain farm for inspection update: ' + farmWithInspection?.facility?.shortCode);
    }
};
const seedFarms = async (farmService, farmInspectionService, locations, customLocations, certificationTypes, prisma, organisation)=>{
    const meta = {
        organisation
    };
    const seasons = await prisma.season.findMany({
        where: {
            organisation
        }
    });
    const activeSeason = seasons.find((season)=>season.active);
    const previousSeason = seasons.find((season)=>!season.active);
    if (!activeSeason) {
        throw new Error('No active season found in db');
    }
    // 1) FARM-series, static farms with specific purpose. See Farmer name for clues!
    const exampleFarms = (0, _exampleFarms.getExampleFarmInputs)(meta.organisation, locations, customLocations, activeSeason.shortCode);
    const payloads = [
        ...exampleFarms
    ];
    // 2) OVERLAP-series, static farms that overlap with each other
    for (const index of [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
    ]){
        const example = (0, _exampleFarms.generateOverlappingFarm)(index, organisation, chance, activeSeason.shortCode);
        await farmService.create(example);
    }
    // 3) RANDO-series, randomly generated farms
    for(let i = 1; i <= 30; i++){
        const location = chance.pickone(locations);
        payloads.push(generateRandomFarm(i, organisation, location, activeSeason.shortCode));
    }
    // 4) Create the farms
    const promises = payloads.map(async (payload)=>farmService.create(payload));
    await Promise.all(promises);
    // 5) Post processing
    const farmsWithIncludes = await farmService.getMany({
        organisation: organisation
    });
    const farmsSet = {};
    farmsWithIncludes.data.forEach((farm)=>{
        farmsSet[farm.facility.shortCode] = farm;
    });
    await addCertifications(farmsSet['FARM-001'], certificationTypes, prisma);
    await addContactAndWallet(farmsSet['FARM-001'], prisma);
    await addSatelliteForFarmOne(farmsSet['FARM-001'], prisma);
    await addSatelliteForFarmTwo(farmsSet['FARM-002'], prisma);
    await receiveFarmInspectionFromV1ForFarm(// FARM-004
    farmsSet[_farmInspectionResultjson.farmInspectionResultFromV1.entity.properties.idLabelShort], farmInspectionService, activeSeason, previousSeason, _farmInspectionResultjson.farmInspectionResultFromV1);
    await receiveFarmInspectionFromV1ForFarm(// FARM-007
    farmsSet[_farmInspectionResultjson.farmInspectionResultFromV2.entity.properties.idLabelShort], farmInspectionService, activeSeason, previousSeason, _farmInspectionResultjson.farmInspectionResultFromV2);
};
