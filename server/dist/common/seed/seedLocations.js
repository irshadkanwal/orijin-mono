"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    exampleCustomLocationData: function() {
        return exampleCustomLocationData;
    },
    exampleLocationData: function() {
        return exampleLocationData;
    },
    seedLocations: function() {
        return seedLocations;
    }
});
const _locationsmodel = require("../../locations/models/locations.model");
const exampleLocationData = (organisation)=>({
        name: 'BUNDIBUGYO',
        shortCode: 'BDG',
        type: 'District',
        organisation,
        children: {
            create: [
                {
                    shortCode: 'BBD',
                    name: 'BUBANDI',
                    type: 'SubCounty',
                    organisation,
                    children: {
                        create: [
                            {
                                shortCode: 'CP-1',
                                name: 'CollectionPoint 1',
                                type: _locationsmodel.LTCCustomLocationLevels.COLLECTIONPOINT,
                                organisation
                            },
                            {
                                shortCode: 'CP-2',
                                name: 'CollectionPoint 2',
                                type: _locationsmodel.LTCCustomLocationLevels.COLLECTIONPOINT,
                                organisation
                            },
                            {
                                shortCode: 'VI-1',
                                name: 'Villge 1',
                                type: 'Village',
                                organisation
                            },
                            {
                                shortCode: 'VI-2',
                                name: 'Villge 2',
                                type: 'Village',
                                organisation
                            },
                            {
                                shortCode: 'VI-3',
                                name: 'Villge 3',
                                type: 'Village',
                                organisation
                            }
                        ]
                    }
                },
                {
                    shortCode: 'BZO',
                    name: 'BUKONZO',
                    type: 'SubCounty',
                    organisation
                },
                {
                    shortCode: 'BTO',
                    name: 'BUNDIBUGYO TOWN COUNCIL',
                    type: 'SubCounty',
                    organisation
                },
                {
                    shortCode: 'BII',
                    name: 'BIREMBO',
                    type: 'SubCounty',
                    organisation
                }
            ]
        }
    });
const exampleCustomLocationData = (organisation)=>({
        name: 'NORTH',
        shortCode: 'NORTH',
        type: _locationsmodel.MhCustomLocationLevels.REGION,
        mainType: _locationsmodel.LocationMainType.CUSTOM,
        organisation,
        children: {
            create: [
                {
                    shortCode: 'BGY',
                    name: 'BUGINYANYA',
                    type: _locationsmodel.MhCustomLocationLevels.ZONE,
                    mainType: _locationsmodel.LocationMainType.CUSTOM,
                    organisation,
                    children: {
                        create: [
                            {
                                shortCode: 'BGL',
                                name: 'BUMUGIBOLE',
                                type: _locationsmodel.MhCustomLocationLevels.FARMER_GROUP,
                                mainType: _locationsmodel.LocationMainType.CUSTOM,
                                organisation
                            },
                            {
                                shortCode: 'KDD',
                                name: 'KIDODO',
                                type: _locationsmodel.MhCustomLocationLevels.FARMER_GROUP,
                                mainType: _locationsmodel.LocationMainType.CUSTOM,
                                organisation
                            },
                            {
                                shortCode: 'LGL',
                                name: 'LOGOLI',
                                type: _locationsmodel.MhCustomLocationLevels.FARMER_GROUP,
                                mainType: _locationsmodel.LocationMainType.CUSTOM,
                                organisation
                            }
                        ]
                    }
                },
                {
                    shortCode: 'KJR',
                    name: 'KAJERE',
                    type: _locationsmodel.MhCustomLocationLevels.ZONE,
                    mainType: _locationsmodel.LocationMainType.CUSTOM,
                    organisation
                },
                {
                    shortCode: 'SPI',
                    name: 'SIPI',
                    type: _locationsmodel.MhCustomLocationLevels.ZONE,
                    mainType: _locationsmodel.LocationMainType.CUSTOM,
                    organisation
                }
            ]
        }
    });
const seedLocations = async (prisma, organisation)=>{
    await prisma.location.create({
        data: exampleLocationData(organisation)
    });
    await prisma.location.create({
        data: exampleCustomLocationData(organisation)
    });
    const global = await prisma.location.findMany({
        where: {
            organisation: organisation,
            mainType: _locationsmodel.LocationMainType.GLOBAL
        },
        include: {
            parent: true
        }
    });
    const custom = await prisma.location.findMany({
        where: {
            organisation: organisation,
            mainType: _locationsmodel.LocationMainType.CUSTOM
        },
        include: {
            parent: true
        }
    });
    return {
        global,
        custom
    };
};
